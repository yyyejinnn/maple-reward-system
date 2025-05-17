import { Injectable } from '@nestjs/common';
import { InviteCountCriteria } from 'apps/event/interfaces/event.condition-criteria.interface';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class InviteCountStrategy implements EventConditionStrategy<InviteCountCriteria> {
  async validate(userId: string, criteria: InviteCountCriteria) {
    // 친구 초대 수 >= criteria.count

    const cnt = 10;
    return cnt >= criteria.count;
  }
}
