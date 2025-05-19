import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from 'apps/event/src/schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetEventByIdPayloadDto } from './dto/get-event.payload.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { CreateEventPayloadDto } from './dto/create-event.payload.dto';
import { EventPeriod } from '@app/common/interfaces/event-period.interface';
import { RpcException } from '@nestjs/microservices';
import { EventConditionStrategyFactory } from '@app/common/strategies/event-condition/event-condition-strategy.factory';
import { EventCondition, EventType } from '@app/common';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private eventConditionFactory: EventConditionStrategyFactory,
  ) {}

  async createEvent(dto: CreateEventPayloadDto) {
    const { title, description, condition, period, isActive, createdBy } = dto;

    // reward optional로 같이 생성할 수 있도록 (트랜젝션 고려)

    this.validateEventConditionStruc(condition);
    this.validateEventPeriod(period);

    await this.saveEvent({
      title,
      description,
      condition,
      period,
      isActive, // 향후 자동 비활성화 로직이 도입된다면 별도 처리
      createdBy,
    });
  }

  private validateEventConditionStruc(condition: EventCondition) {
    const { type, criteria } = condition;

    if (!Object.values(EventType).includes(type)) {
      throw new RpcException(`유효하지않은 type 입니다.(${type})`);
    }

    const strategy = this.eventConditionFactory.getStrategy(type);
    const { valid, cause } = strategy.validateCriteriaStructure(criteria);

    if (!valid) {
      throw new RpcException(cause ?? 'criteria를 다시 한번 확인해주세요.');
    }
  }

  private validateEventPeriod(period: EventPeriod) {
    const { start, end } = period;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const now = new Date();

    if (startDate < now) {
      throw new RpcException('이벤트 시작일은 현재 시각보다 미래여야 합니다.');
    }

    if (startDate > endDate) {
      throw new RpcException('이벤트 시작일은 종료일보다 빨라야합니다.');
    }
  }

  private async saveEvent(fields: {
    title: string;
    description?: string;
    condition: EventCondition;
    period: EventPeriod;
    isActive: boolean;
    createdBy: string;
  }) {
    const event = new this.eventModel(fields);

    return await event.save();
  }

  async listEvents() {
    const eventDocs = await this.eventModel.find().sort({ createdAt: -1 }).lean();

    const result = eventDocs.map(doc => this.toEventResponse(doc));

    return result;
  }

  async getEventById(dto: GetEventByIdPayloadDto) {
    const { id } = dto;
    const doc = await this.eventModel.findById(id).lean();
    return doc ? this.toEventResponse(doc) : null;
  }

  private toEventResponse(doc: EventDocument): EventResponseDto {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      condition: doc.condition,
      period: doc.period,
      isActive: doc.isActive,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
    };
  }
}
