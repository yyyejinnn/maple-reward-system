import { Injectable } from '@nestjs/common';
import { CreateRewardPayloadDto } from './dto/create-reward.payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from 'apps/event/schemas/reward.schema';
import { Model, Types } from 'mongoose';
import { GetRewardByIdPayloadDto } from './dto/get-reward.payload.dto';
import { RewardResponseDto } from './dto/reward-response.dto';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  async createReward(dto: CreateRewardPayloadDto) {
    const { eventId, type, name, amount, meta, createdBy } = dto;

    // 이벤트 유효성 체크
    // 존재하는지?
    // 활성화 돼 있는지?
    // 기간?

    const reward = new this.rewardModel({
      eventId: new Types.ObjectId(eventId),
      type,
      name,
      amount,
      createdBy,
    });

    if (meta) reward.meta = meta;

    return await reward.save();
  }

  async listRewards() {
    const rewardDocs = await this.rewardModel
      .find()
      .sort({ createdAt: -1 })
      .populate('eventId', 'title period isActive')
      .lean();

    return rewardDocs.map(doc => this.toRewardResponse(doc));
  }

  async getRewardById(dto: GetRewardByIdPayloadDto) {
    const { id } = dto;
    const doc = await this.rewardModel
      .findById(id)
      .populate('eventId', 'title period isActive')
      .lean();

    return doc ? this.toRewardResponse(doc) : null;
  }

  private toRewardResponse(doc: any): RewardResponseDto {
    const event = doc.eventId;

    return {
      id: doc._id.toString(),
      type: doc.type,
      name: doc.name,
      amount: doc.amount,
      event: {
        id: event._id.toString(),
        title: event.title,
        isActive: event.isActive,
        period: event.period,
      },
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
    };
  }
}
