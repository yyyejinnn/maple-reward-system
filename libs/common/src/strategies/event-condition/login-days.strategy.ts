import { Injectable } from '@nestjs/common';
import { EventType, LoginDaysCriteria } from '@app/common';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class LoginDaysStrategy implements EventConditionStrategy<EventType.LOGIN_DAYS> {
  async validate(userId: string, criteria: LoginDaysCriteria) {
    // 유저 로그인 일수 >= criteria.days
    const days = 10;
    return days >= criteria.days;
  }

  validateStructure(criteria: object) {
    if (criteria?.['days'] == null) {
      return { valid: false, cause: '"days" 필드가 누락됐습니다.' };
    }

    if (typeof criteria?.['count'] !== 'number') {
      return { valid: false, cause: '"days" 필드는 number여야 합니다.' };
    }
  }
}
