import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRewardClaimPayloadDto } from './dto/create-reward-claim.payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimDocument } from 'apps/event/schemas/reward-claim.schema';
import { Model } from 'mongoose';
import { GetRewardByIdPayloadDto } from '../reward/dto/get-reward.payload.dto';
import { ListRewardClaimsByUserIdPayloadDto } from './dto/list-reward-claims-by-user-id.payload.dto';

@Injectable()
export class RewardClaimService {
  constructor(
    @InjectModel(RewardClaim.name) private rewardClaimModel: Model<RewardClaimDocument>,
  ) {}

  async createRewardClaim(dto: CreateRewardClaimPayloadDto) {
    const { rewardId, userId, userEmail, userNickname } = dto;

    // 1. 중복 요청 방지
    const existing = await this.rewardClaimModel.exists({ rewardId, userId });

    if (existing) {
      //   throw new ConflictException('중복 요청');
    }

    // 2. 조건 충족 여부 검증 (strategy)

    // 3. 기록
    // err.code === 11000 ??
    const claim = new this.rewardClaimModel({
      rewardId,
      userId,
      userEmail,
      userNickname,
      claimStatus: 'SUCCESS', // 성공 or 실패
    });

    return await claim.save();
  }

  async listRewardClaims() {
    const claimDocs = await this.rewardClaimModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'rewardId',
        populate: {
          path: 'eventId',
        },
      })
      .lean();

    return claimDocs.map(doc => this.toRewardClaimResponse(doc));
  }

  async listRewardClaimsByUserId(dto: ListRewardClaimsByUserIdPayloadDto) {
    const { userId } = dto;

    const claimDocs = await this.rewardClaimModel
      .find({ userId }) // listRewardClaims 랑 비교
      .sort({ createdAt: -1 })
      .populate({
        path: 'rewardId',
        populate: {
          path: 'eventId',
        },
      })
      .lean();

    return claimDocs.map(doc => this.toRewardClaimResponse(doc));
  }

  async getRewardClaimById(dto: GetRewardByIdPayloadDto) {
    const { id } = dto; // userId?

    const claimDoc = await this.rewardClaimModel
      .findById(id)
      .populate({
        path: 'rewardId',
        populate: {
          path: 'eventId',
        },
      })
      .lean();

    return this.toRewardClaimResponse(claimDoc);
  }

  // 수정 필요
  private toRewardClaimResponse(doc: any) {
    return doc;
  }
}
