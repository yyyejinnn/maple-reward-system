import { Injectable } from '@nestjs/common';
import { LoginDaysStrategy } from './login-days.strategy';
import { InviteCountStrategy } from './invite-count.strategy';
import { EventType } from '@app/common/enums/event-type.enum';
import { LevelReachedStrategy } from './level-reached.strategy';

@Injectable()
export class EventConditionStrategyFactory {
  constructor(
    private loginDaysStrategy: LoginDaysStrategy,
    private inviteCountStrategy: InviteCountStrategy,
    private levelReachedStrategy: LevelReachedStrategy,
  ) {}

  getStrategy(type: EventType) {
    switch (type) {
      case EventType.LOGIN_DAYS:
        return this.loginDaysStrategy;
      case EventType.INVITE_COUNT:
        return this.inviteCountStrategy;
      case EventType.LEVEL_REACHED:
        return this.levelReachedStrategy;
      default:
        throw new Error(`지원하지 않는 조건 타입입니다.(${type})`);
    }
  }
}
