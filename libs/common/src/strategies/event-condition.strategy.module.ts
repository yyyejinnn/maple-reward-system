import { Module } from '@nestjs/common';
import { EventConditionStrategyFactory } from './event-condition/event-condition-strategy.factory';
import { LoginDaysStrategy } from './event-condition/login-days.strategy';
import { InviteCountStrategy } from './event-condition/invite-count.strategy';
import { LevelReachedStrategy } from './event-condition/level-reached.strategy';

@Module({
  providers: [
    EventConditionStrategyFactory,
    LoginDaysStrategy,
    InviteCountStrategy,
    LevelReachedStrategy,
  ],
  exports: [EventConditionStrategyFactory],
})
export class EventConditionStrategyModule {}
