import { Controller, Get } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventPatterns } from '@app/common';
import { GetEventByIdPayloadDto } from './dto/get-event.payload.dto';
import { CreateEventPayloadDto } from './dto/create-event.payload.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: EventPatterns.CreateEvent })
  async createEvent(@Payload() dto: CreateEventPayloadDto) {
    return this.eventService.createEvent(dto);
  }

  @MessagePattern({ cmd: EventPatterns.ListEvents })
  async listEvents() {
    return this.eventService.listEvents();
  }

  @MessagePattern({ cmd: EventPatterns.GetEventById })
  async getEventById(@Payload() dto: GetEventByIdPayloadDto) {
    return this.eventService.getEventById(dto);
  }
}
