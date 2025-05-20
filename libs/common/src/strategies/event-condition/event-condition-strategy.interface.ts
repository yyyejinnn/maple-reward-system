import { EventType } from '@app/common';
import { EventConditionCriteriaMap } from '@app/common/interfaces/event-criteria-map.type';

export interface EventConditionStrategy<T extends EventType> {
  // 보상 조건 충족 여부 검증
  validateCondition(userId: string, criteria: EventConditionCriteriaMap[T]): Promise<boolean>;

  // 이벤트 생성 시, condition.criteria 구조 검증
  validateCriteriaStructure(criteria: object): {
    valid: boolean;
    cause?: string;
  };
}
