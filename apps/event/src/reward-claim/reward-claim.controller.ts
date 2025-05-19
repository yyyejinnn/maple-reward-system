import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardClaimService } from './reward-claim.service';
import { RewardClaimPatterns } from '@app/common';
import { GetRewardByIdPayloadDto } from '../reward/dto/get-reward.payload.dto';
import { ListRewardClaimsByUserIdPayloadDto } from './dto/list-reward-claims-by-user-id.payload.dto';
import { ListRewardClaimsPayloadDto } from './dto/list-reward-claims.payload.dto';
import { CreateRewardClaimPayloadDto } from './dto/create-reward-claim.payload.dto';

@Controller()
export class RewardClaimController {
  constructor(private readonly rewardClaimService: RewardClaimService) {}

  @MessagePattern({ cmd: RewardClaimPatterns.CreateRewardClaim })
  async createRewardClaim(@Payload() dto: CreateRewardClaimPayloadDto) {
    return await this.rewardClaimService.createRewardClaim(dto);
  }

  @MessagePattern({ cmd: RewardClaimPatterns.ListRewardClaims })
  async listRewardClaims(@Payload() dto: ListRewardClaimsPayloadDto) {
    return await this.rewardClaimService.listRewardClaimsByFilter(dto);
  }

  @MessagePattern({ cmd: RewardClaimPatterns.GetRewardClaimById })
  async getRewardClaimById(@Payload() dto: GetRewardByIdPayloadDto) {
    return await this.rewardClaimService.getRewardClaimById(dto);
  }
}
