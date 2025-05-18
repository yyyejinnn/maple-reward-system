import { Module } from '@nestjs/common';
import { RewardClaimController } from './reward-claim.controller';
import { RewardClaimService } from './reward-claim.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimSchema } from 'apps/event/src/schemas/reward-claim.schema';
import { Reward, RewardSchema } from 'apps/event/src/schemas/reward.schema';
import { InviteCountStrategy } from '../../../../libs/common/src/strategies/event-condition/invite-count.strategy';
import { LoginDaysStrategy } from '../../../../libs/common/src/strategies/event-condition/login-days.strategy';
import { LevelReachedStrategy } from '../../../../libs/common/src/strategies/event-condition/level-reached.strategy';
import { EventConditionStrategyFactory } from '../../../../libs/common/src/strategies/event-condition/event-condition-strategy.factory';
import { EventConditionStrategyModule } from '@app/common/strategies/event-condition.strategy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardClaim.name, schema: RewardClaimSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
    EventConditionStrategyModule,
  ],
  controllers: [RewardClaimController],
  providers: [RewardClaimService],
})
export class RewardClaimModule {}
