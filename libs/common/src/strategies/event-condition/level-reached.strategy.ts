import { Injectable } from '@nestjs/common';
import { EventType, LevelReachedCriteria } from '@app/common';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class LevelReachedStrategy implements EventConditionStrategy<EventType.LEVEL_REACHED> {
  async validateCondition(userId: string, criteria: LevelReachedCriteria) {
    const mockLevel = 15; //성공 케이스

    return mockLevel >= criteria.minLevel;
  }

  validateCriteriaStructure(criteria: object) {
    if (criteria?.['level'] == null) {
      return { valid: false, cause: '"level" 필드가 누락됐습니다.' };
    }

    if (typeof criteria?.['level'] !== 'number') {
      return { valid: false, cause: '"level" 필드는 number여야 합니다.' };
    }

    return { valid: true };
  }
}
