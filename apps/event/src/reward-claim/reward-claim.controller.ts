import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardClaimService } from './reward-claim.service';
import { RewardClaimPatterns } from 'libs/constants/patterns/reward-claim.patterns';

@Controller()
export class RewardClaimController {
  constructor(private readonly rewardClaimService: RewardClaimService) {}

  @MessagePattern({ cmd: RewardClaimPatterns.CreateRewardCliam })
  async createRewardCliam(@Payload() dto) {
    return await this.rewardClaimService.createRewardCliam(dto);
  }

  @MessagePattern({ cmd: RewardClaimPatterns.ListRewardCliams })
  async listRewardClaims() {
    return await this.rewardClaimService.listRewardClaims();
  }

  @MessagePattern({ cmd: RewardClaimPatterns.GetRewardCliamById })
  async getRewardClaimById(@Payload() dto) {
    return await this.rewardClaimService.getRewardClaimById(dto);
  }

  @MessagePattern({ cmd: RewardClaimPatterns.GetRewardCliamByUserId })
  async getRewardCliamByUserId(@Payload() dto) {
    return await this.rewardClaimService.getRewardCliamByUserId(dto);
  }
}
