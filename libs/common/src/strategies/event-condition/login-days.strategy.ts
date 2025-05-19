import { Injectable } from '@nestjs/common';
import { EventType, LoginDaysCriteria } from '@app/common';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class LoginDaysStrategy implements EventConditionStrategy<EventType.LOGIN_DAYS> {
  async validateCondition(userId: string, criteria: LoginDaysCriteria) {
    const mockDays = 5; // 성공 케이스

    return mockDays >= criteria.days;
  }

  validateCriteriaStructure(criteria: object) {
    if (criteria?.['days'] == null) {
      return { valid: false, cause: '"days" 필드가 누락됐습니다.' };
    }

    if (typeof criteria?.['days'] !== 'number') {
      return { valid: false, cause: '"days" 필드는 number여야 합니다.' };
    }

    return { valid: true };
  }
}
