import { Injectable } from '@nestjs/common';
import { CreateRewardClaimPayloadDto } from './dto/create-reward-claim.payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RewardClaim, RewardClaimDocument } from 'apps/event/src/schemas/reward-claim.schema';
import { Model, Types } from 'mongoose';
import { GetRewardByIdPayloadDto } from '../reward/dto/get-reward.payload.dto';
import { ListRewardClaimsByUserIdPayloadDto } from './dto/list-reward-claims-by-user-id.payload.dto';
import { Reward, RewardDocument } from 'apps/event/src/schemas/reward.schema';
import { EventConditionStrategyFactory } from '@app/common/strategies/event-condition/event-condition-strategy.factory';
import { RpcException } from '@nestjs/microservices';
import { ListRewardClaimsPayloadDto } from './dto/list-reward-claims.payload.dto';
import { BaseRewardClaimFilterQuery } from '@app/common';

@Injectable()
export class RewardClaimService {
  constructor(
    @InjectModel(RewardClaim.name) private rewardClaimModel: Model<RewardClaimDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,

    private conditionFactory: EventConditionStrategyFactory,
  ) {}

  async createRewardClaim(dto: CreateRewardClaimPayloadDto) {
    const { rewardId, userId, userEmail, userNickname } = dto;

    await this.validateClaimRequest(rewardId, userId); // 요청에 대한 유효성 검증
    await this.ensureRewardConditionMet(userId, rewardId); // 보상 조건 충족 여부 검증

    return await this.saveRewardClaim({
      rewardId,
      userId,
      userEmail,
      userNickname,
    });
  }

  private async validateClaimRequest(rewardId: string, userId: string) {
    const existing = await this.rewardClaimModel.exists({ rewardId, userId });
    if (existing) {
      throw new RpcException('이미 요청된 내역입니다.');
    }

    // 그외 유효성 체크...
  }

  private async saveRewardClaim(fields: {
    rewardId: string;
    userId: string;
    userEmail: string;
    userNickname: string;
  }) {
    try {
      const claim = new this.rewardClaimModel(fields);

      await claim.save();
    } catch (err) {
      if (err?.code === 11000) {
        throw new RpcException('중복 요청입니다. (duplicate key err)');
      }

      throw err;
    }
  }

  private async ensureRewardConditionMet(userId: string, rewardId: string) {
    const reward = await this.rewardModel
      .findById(rewardId)
      .select('_id')
      .populate({ path: 'eventId', select: 'condition' })
      .lean();

    const { type, criteria } = reward.eventId?.['condition'];

    const strategy = this.conditionFactory.getStrategy(type);

    const isConditionMet = await strategy.validateCondition(userId, criteria);

    if (!isConditionMet) {
      throw new RpcException('보상 조건을 충족하지 못했습니다.');
    }
  }

  async listRewardClaimsByFilter(dto: ListRewardClaimsPayloadDto) {
    const { query } = dto;

    const claimDocs = await this.rewardClaimModel
      .find(await this.buildRewardClaimFilter(query))
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

  private async buildRewardClaimFilter(query: BaseRewardClaimFilterQuery) {
    const filter: any = {};

    if (query.progress) {
      filter.progress = query.progress;
    }

    if (query.userId) {
      filter.userId = query.userId;
    }

    // claim -> reward -> event
    if (query.eventId) {
      const rewardDocs = await this.rewardModel
        .find({
          eventId: new Types.ObjectId(query.eventId),
        })
        .select('_id');

      const rewardIds = rewardDocs.map(doc => doc._id.toString());
      filter.rewardId = { $in: rewardIds };
    }

    return filter;
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
