import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from 'apps/event/schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetEventByIdPayloadDto } from './dto/get-event.payload.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { CreateEventPayloadDto } from './dto/create-event.payload.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async createEvent(dto: CreateEventPayloadDto) {
    const { title, description, condition, period, createdBy } = dto;

    // reward optional로 같이 생성할 수 있도록 (트랜젝션 고려)
    // period 기간 유효성 검증 필요

    const event = new this.eventModel({
      title,
      description,
      condition,
      period, // isActive 유효성 체크 필요
      createdBy,
      isActive: true,
    });

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
