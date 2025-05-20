## 프로젝트 실행

```bash
$ git clone https://github.com/yyyejinnn/maplestory-reward-system.git
$ cd maplestory-reward-system

# 빌드 및 실행
$ docker-compose up --build

# 종료 (-v: volume 삭제)
$ docker-compose down
$ docker-compose down -v
```

- 임의의 유저(user), 이벤트(event), 보상(reward) 데이터가 자동 생성됩니다.
- [http://localhost:3000](http://localhost:3000/) 기준으로 호출할 수 있습니다.

<br/>

## 프로젝트 구조

```bash
apps/
├── auth/      # Auth 서버 (auth 모듈)
├── event/     # Event 서버 (event, reward, reward-claim 모듈)
├── gateway/   # Gateway 서버
│       ├── passport/, policies/, role/    # 인증/인가 모듈 포함
│       ├── rpc-client/                    # TCP 메시지 wrapper 서비스
libs/common/ 
    ├── strategies/                        # 전략 모듈 (ex. 이벤트 조건 전략)
    ├── dto/, enums/, interfaces/          # 공통 타입 정의
    ├── exception-filters/, interceptors/  # 공통 미들웨어
```

- 애플리케이션은 Auth, Event, Gateway 서버 기준으로 분리했으며, 그 안에서 세부 도메인 단위로 모듈화했습니다.
- 서버 별 역할과 책임을 확실하게 분리하고자 했습니다. 인증/인가 처리는 전부 Gateway에 전담하고, 내부 서버는 비즈니스 로직에 집중할 수 있도록 구성했습니다.
- strategies 모듈을 event/ 와 libs/ 중 어디에 둘 지 고민하다, 확장될 가능성을 고려하여 libs/ 에 포함시켰습니다.

<br/>

## MSA - TCP 메시지 패턴 기반 통신
#### HTTP vs TCP
- 처음에는 익숙한 REST API 기반으로 통신하려했으나, Auth, Event 서버도 외부에 노출될 수 있다는 리스크를 인지했습니다. 따라서 내부 통신은 @nest/microservice 기반의 TCP로 , 외부 HTTP 요청은 Gatway만을 통할 수 있도록 구성했습니다.
- 요청에 대한 응답이 필요한 구조이기 때문에 이벤트 기반 대신 Request-Response 메시지 패턴을 적용했습니다.
    
#### RcpClient wrapper 모듈 적용 (RpcClientModule)
- .send() 요청에 대한 응답은 Observable로 오고, 컨트롤러에서 자동으로 변환됩니다. 하지만 JwtGuard에서는 lastValueFrom를 명시적으로 써줘야했고, 에러 필터가 예상대로 동작하지않아 요청마다 catchError()로 핸들링 해줘야했습니다.
- 일관된 제어와 유지보수를 위해 RpcClientService 를 생성했습니다. GatewayService는 Request에만 집중하고 rcp 통신 제어는 RpcClientService가 담당하여, 역할을 명확히 할 수 있었습니다.

<br/>

## 인증/인가/권한 정책

#### 인증 및 인가
- 인증은 Passport 기반의 Local, JWT 전략을 사용했고, 인가는 RoleGuard 기반의 RBAC 구조로 적용했습니다.

#### 데이터 소유권 (본인 인증)
- ‘나의 보상 요청 내역’처럼 본인 데이터만 조회해야 할 경우, 요청 처리 서버와 실제 데이터를 관리하는 서버가 달라 소유권 검증을 어디에서 해야 할지 고민이었습니다. 최종적으로 Gateway에 책임을 뒀으며, 추후 구조가 변경될 가능성도 고려해 PoliciesModule로 분리한 뒤 이를 주입받도록 구현했습니다.

<br/>

## 이벤트 조건 타입 구조화
- 반복될 거라 예상되는 이벤트를 유형(EventType)별로 구분하고, 유형 별로 조건(criteria)을 정의하여 타입 안정성과 확장성을 높였습니다. 이를 통해 Strategy에서도 타입에 맞는 검증 로직을 적용할 수 있도록 구현했습니다.
    
    ```tsx
    export type EventConditionCriteriaMap = {
      [EventType.LOGIN_DAYS]: LoginDaysCriteria;
      [EventType.INVITE_COUNT]: InviteCountCriteria;
      [EventType.LEVEL_REACHED]: LevelReachedCriteria;
    };
    
    /** 'LOGIN_DAYS' 예시 */
    export interface LoginDaysCriteria {
      days: number;
    }
    
    /** 조건 Strategy 인터페이스 */
    export interface EventConditionStrategy<T extends EventType> {
      validateCondition(userId: string, criteria: EventConditionCriteriaMap[T]): Promise<boolean>;
    }
    
    /** LoginDaysStrategy 예시 */
    export class LoginDaysStrategy implements EventConditionStrategy<EventType.LOGIN_DAYS> {
      async validateCondition(userId: string, criteria: LoginDaysCriteria) {}
    }
    ```

<br/> 

## 보상 조건 충족 여부 검증 - Strategy 패턴, Factory 패턴
- 정형화 되지 않은 이벤트 조건들을 어떻게 구조화할지가 가장 큰 고민했습니다. 출석, 친구 초대처럼 자주 쓰이는 조건을 각각의 전략으로 나눴습니다.
    - validateCriteriaStructure: 이벤트 생성 시 DTO 구조 검증
    - validateCondition: 보상 요청 시 조건 충족 여부 검증
- 전략 생성 팩토리를 적용하여 외부 결합도를 낮추고, 새로운 조건들의 유연한 확장을 고려했습니다.
- 정성적 조건들은 어떻게 구조화할 수 있을지 고민 중에 있습니다.

<br/>

## 스키마 설계 관련
#### 이벤트와 보상의 참조 방향 (Reward→Event)
- 보상 이력 확인, 보상 요청처럼 보상이 주체가 되는 기능이 많아, 보상이 이벤트에 포함되는 것보다는 이벤트를 참조하는 방향이 더 자연스럽다고 판단했습니다.
#### 보상 요청 필드 - 조건 충족 여부 / 운영자 승인 여부
- 처음에는 조건 충족 여부에 관계없이 로그성으로 기록하려 했으나, 오히려 정합성 검증 로직이 복잡해지고 이점이 적었습니다. 결국 해당 필드는 제거했고, 필요해지면 별도의 로그성 테이블 구성하는게 낫다고 생각했습니다.
#### 유저 정보 중복 기록
- 보상 지급 내역 조회 등 유저 정보가 포함되어야할 경우가 많은데, 매번 Auth 서버를 호출하는 건 부담이 큽니다. 그리고 이벤트/보상은 대부분 일회성 데이터로 변경에 실시간으로 대응할 필요가 크지 않다고 생각했습니다. 따라서 유저의 email, nickname를 중복 저장했습니다.

<br/>

## API 구조 및 URL 설계 관련
#### 도메인 간 책임 분리
- 초기에 만든 listRewardClaimsByUserId(나의 보상 요청 내역 조회)가 유저 도메인(userId)에 종속된다고 느꼈습니다. 이를 개선하기 위해 조건을 기반으로 필터링할 수 있도록 변경하고, userId를 필터링 조건으로 전달하는 구조로 변경했습니다.
#### 유저 소유의 자원 처리 방식
- ‘나의 보상 요청 내역’처럼 유저가 소유한 자원을 필요로 할때, 어느 서버에서 다뤄야할 지 고민이 있었습니다. 최종적으로 스키마, 비즈니스 로직의 주체가 자원(Event)에 있다고 판단했습니다. 소유에 대한 개념은 URL 구조로 표현했습니다(ex. ‘/my/…’).
#### 유저 정보 포함 방식 - Auth 호출 vs 중복 저장
- 관리자가 ‘특정 유저의 보상 요청 내역을 조회’한다고 가정 했을 때, 정합성보다는 조회 성능이 더 중요하다고 판단했습니다. 따라서 Auth 서버를 호출하는 대신 유저 정보를 일부 중복 저장하는 방식으로 구현했습니다.
