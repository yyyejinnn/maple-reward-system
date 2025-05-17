import { Injectable } from '@nestjs/common';
import { LevelReachedCriteria } from 'apps/event/interfaces/event.condition-criteria.interface';
import { EventConditionStrategy } from './event-condition-strategy.interface';

@Injectable()
export class LevelReachedStrategy implements EventConditionStrategy<LevelReachedCriteria> {
  async validate(userId: string, criteria: LevelReachedCriteria) {
    // 유저 레벨 >= criteria.minLevel
    const level = 15;
    return level >= criteria.minLevel;
  }
}
