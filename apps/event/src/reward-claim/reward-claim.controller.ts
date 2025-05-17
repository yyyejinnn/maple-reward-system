import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardClaimService } from './reward-claim.service';
import { RewardClaimPatterns } from 'libs/constants/patterns/reward-claim.patterns';
import { GetRewardByIdPayloadDto } from '../reward/dto/get-reward.payload.dto';
import { ListRewardClaimsByUserIdPayloadDto } from './dto/list-reward-claims-by-user-id.payload.dto';

@Controller()
export class RewardClaimController {
  constructor(private readonly rewardClaimService: RewardClaimService) {}

  @MessagePattern({ cmd: RewardClaimPatterns.CreateRewardClaim })
  async createRewardClaim(@Payload() dto) {
    return await this.rewardClaimService.createRewardClaim(dto);
  }

  @MessagePattern({ cmd: RewardClaimPatterns.ListRewardClaims })
  async listRewardClaims() {
    return await this.rewardClaimService.listRewardClaims();
  }

  @MessagePattern({ cmd: RewardClaimPatterns.GetRewardClaimById })
  async getRewardClaimById(@Payload() dto: GetRewardByIdPayloadDto) {
    return await this.rewardClaimService.getRewardClaimById(dto);
  }

  @MessagePattern({ cmd: RewardClaimPatterns.ListRewardClaimsByUserId })
  async listRewardClaimsByUserId(@Payload() dto: ListRewardClaimsByUserIdPayloadDto) {
    return await this.rewardClaimService.listRewardClaimsByUserId(dto);
  }
}
