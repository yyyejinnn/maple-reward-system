import { Injectable } from '@nestjs/common';
import { EventConditionStrategy } from './event-condition-strategy.interface';
import { EventType, InviteCountCriteria } from '@app/common';

@Injectable()
export class InviteCountStrategy implements EventConditionStrategy<EventType.INVITE_COUNT> {
  async validate(userId: string, criteria: InviteCountCriteria) {
    // 친구 초대 수 >= criteria.count

    const cnt = 10;
    return cnt >= criteria.count;
  }
}
