import { Module } from '@nestjs/common';
import { RewardClaimPolicyService } from './reward-cliam.policy.service';

@Module({
  providers: [RewardClaimPolicyService],
  exports: [RewardClaimPolicyService],
})
export class PolicyModule {}
