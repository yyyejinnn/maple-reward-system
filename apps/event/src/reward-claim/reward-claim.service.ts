import { Injectable } from '@nestjs/common';
import { CreateRewardClaimPayloadDto } from './dto/create-reward-claim.payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimDocument } from 'apps/event/schemas/reward-claim.schema';
import { Model } from 'mongoose';
import { GetRewardByIdPayloadDto } from '../reward/dto/get-reward.payload.dto';
import { ListRewardClaimsByUserIdPayloadDto } from './dto/list-reward-claims-by-user-id.payload.dto';
import { Reward, RewardDocument } from 'apps/event/schemas/reward.schema';
import { RewardClaimStatus } from '@app/common';
import { EventConditionStrategyFactory } from '@app/common/strategies/event-condition/event-condition-strategy.factory';

@Injectable()
export class RewardClaimService {
  constructor(
    @InjectModel(RewardClaim.name) private rewardClaimModel: Model<RewardClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,

    private conditionFactory: EventConditionStrategyFactory,
  ) {}

  async createRewardClaim(dto: CreateRewardClaimPayloadDto) {
    const { rewardId, userId, userEmail, userNickname } = dto;

    // 1. 중복 요청 방지
    const existing = await this.rewardClaimModel.exists({ rewardId, userId });

    if (existing) {
      //   throw new ConflictException('중복 요청');
    }

    // 2. 조건 충족 여부 검증 (strategy)
    const isValid = await this.validateClaimCondition(userId, rewardId);

    const claimStatus: RewardClaimStatus = isValid
      ? RewardClaimStatus.SUCCESS
      : RewardClaimStatus.FAILED;

    // 3. 기록
    // err.code === 11000 ??
    const claim = new this.rewardClaimModel({
      rewardId,
      userId,
      userEmail,
      userNickname,
      claimStatus,
    });

    return await claim.save();
  }

  private async validateClaimCondition(userId: string, rewardId: string): Promise<boolean> {
    const reward = await this.rewardModel
      .findById(rewardId)
      .select('_id')
      .populate({ path: 'eventId', select: 'condition' })
      .lean();

    const { type, criteria } = reward.eventId?.['condition'];

    const strategy = this.conditionFactory.getStrategy(type);

    return await strategy.validate(userId, criteria);
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
