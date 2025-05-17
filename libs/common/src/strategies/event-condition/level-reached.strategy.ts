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
}
