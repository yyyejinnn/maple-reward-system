import { Injectable } from '@nestjs/common';
import { CreateEventPayloadDto } from './dto/create.event.payload.dto';
import { Event, EventDocument } from 'apps/event/schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async createEvent(dto: CreateEventPayloadDto) {
    const { title, description, condition, period, createdBy } = dto;

    const event = new this.eventModel({
      title,
      description,
      condition,
      period, // isActive 유효성 체크 필요
      createdBy,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await event.save();
  }
}
