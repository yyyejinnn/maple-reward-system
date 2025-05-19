import { Injectable } from '@nestjs/common';
import { EventConditionStrategy } from './event-condition-strategy.interface';
import { EventType, InviteCountCriteria } from '@app/common';

@Injectable()
export class InviteCountStrategy implements EventConditionStrategy<EventType.INVITE_COUNT> {
  async validateCondition(userId: string, criteria: InviteCountCriteria) {
    // 친구 초대 수 >= criteria.count

    const cnt = 10;
    return cnt >= criteria.count;
  }

  validateCriteriaStructure(criteria: object) {
    if (criteria?.['count'] == null) {
      return { valid: false, cause: '"count" 필드가 누락됐습니다.' };
    }

    if (typeof criteria?.['count'] !== 'number') {
      return { valid: false, cause: '"count" 필드는 number여야 합니다.' };
    }

    return { valid: true };
  }
}
