import { Controller } from '@nestjs/common';
import { RewardService } from './reward.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RewardPatterns } from '@app/common';
import { CreateRewardPayloadDto } from './dto/create-reward.payload.dto';
import { GetRewardByIdPayloadDto } from './dto/get-reward.payload.dto';

@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @MessagePattern({ cmd: RewardPatterns.CreateReward })
  async createReward(@Payload() dto: CreateRewardPayloadDto) {
    return this.rewardService.createReward(dto);
  }

  @MessagePattern({ cmd: RewardPatterns.ListRewards })
  async listRewards() {
    return this.rewardService.listRewards();
  }

  @MessagePattern({ cmd: RewardPatterns.GetRewardById })
  async getRewardById(@Payload() dto: GetRewardByIdPayloadDto) {
    return this.rewardService.getRewardById(dto);
  }
}
