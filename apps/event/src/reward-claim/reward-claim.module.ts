import { Module } from '@nestjs/common';
import { RewardClaimController } from './\breward-claim.controller';
import { RewardClaimService } from './reward-claim.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimSchema } from 'apps/event/schemas/reward-claim.schema';

@Module({
  imports: [],
  controllers: [RewardClaimController],
  providers: [RewardClaimService],
})
export class RewardClaimModule {}
