import { Injectable } from '@nestjs/common';
import { CreateRewardPayloadDto } from './dto/create-reward.payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reward, RewardDocument } from 'apps/event/src/schemas/reward.schema';
import { Model, Types } from 'mongoose';
import { GetRewardByIdPayloadDto } from './dto/get-reward.payload.dto';
import { RewardResponseDto } from './dto/reward-response.dto';
import { RewardType } from '@app/common';
import { EventDocument } from '../schemas/event.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async createReward(dto: CreateRewardPayloadDto) {
    const { eventId, type, name, amount, meta, createdBy } = dto;

    await this.validateEventOfReward(eventId);
    await this.saveReward({ eventId, type, name, amount, createdBy, meta });
  }

  private async validateEventOfReward(eventId: string) {
    const event = await this.eventModel.findById({ eventId }).lean();

    if (!event) {
      throw new RpcException('존재하지 않는 이벤트 입니다.');
    }

    if (!event.isActive) {
      throw new RpcException('비활성화 된 이벤트 입니다.');
    }

    const now = new Date();
    if (event.period?.start > now || event.period?.end < now) {
      throw new RpcException('이벤트 기간이 아닙니다.');
    }
  }

  private async saveReward(fields: {
    eventId: string;
    type: RewardType;
    name: string;
    amount: number;
    createdBy: string;
    meta?: object;
  }) {
    const { eventId } = fields;

    const reward = new this.rewardModel({
      ...fields,
      eventId: new Types.ObjectId(eventId),
    });

    await reward.save();
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
