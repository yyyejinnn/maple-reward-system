import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRewardClaimPayloadDto } from './dto/create-reward-claim.payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimDocument } from 'apps/event/schemas/reward-claim.schema';
import { Model } from 'mongoose';

@Injectable()
export class RewardClaimService {
  constructor(
    @InjectModel(RewardClaim.name) private rewardClaimModel: Model<RewardClaimDocument>,
  ) {}

  async createRewardCliam(dto) {}

  async listRewardClaims() {}

  async getRewardClaimById(dto) {}

  async getRewardCliamByUserId(dto) {}
}
