import { Module } from '@nestjs/common';
import { RewardClaimController } from './reward-claim.controller';
import { RewardClaimService } from './reward-claim.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimSchema } from 'apps/event/schemas/reward-claim.schema';
import { Reward, RewardSchema } from 'apps/event/schemas/reward.schema';
import { InviteCountStrategy } from '../../../../libs/common/src/strategies/event-condition/invite-count.strategy';
import { LoginDaysStrategy } from '../../../../libs/common/src/strategies/event-condition/login-days.strategy';
import { LevelReachedStrategy } from '../../../../libs/common/src/strategies/event-condition/level-reached.strategy';
import { EventConditionStrategyFactory } from '../../../../libs/common/src/strategies/event-condition/event-condition-strategy.factory';

const strategies = [
  EventConditionStrategyFactory,
  LoginDaysStrategy,
  InviteCountStrategy,
  LevelReachedStrategy,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardClaim.name, schema: RewardClaimSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  controllers: [RewardClaimController],
  providers: [RewardClaimService, ...strategies],
})
export class RewardClaimModule {}
