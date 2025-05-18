import { Injectable } from '@nestjs/common';
import { EventType, LevelReachedCriteria } from '@app/common';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class LevelReachedStrategy implements EventConditionStrategy<EventType.LEVEL_REACHED> {
  async validate(userId: string, criteria: LevelReachedCriteria) {
    // 유저 레벨 >= criteria.minLevel
    const level = 15;
    return level >= criteria.minLevel;
  }

  validateStructure(criteria: object) {
    if (criteria?.['level'] == null) {
      return { valid: false, cause: '"level" 필드가 누락됐습니다.' };
    }

    if (typeof criteria?.['count'] !== 'number') {
      return { valid: false, cause: '"level" 필드는 number여야 합니다.' };
    }
  }
}
