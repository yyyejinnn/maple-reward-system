import { Controller, Get } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventPatterns } from 'libs/constants/patterns/event.patterns';
import { CreateEventPayloadDto } from './dto/create.event.payload.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: EventPatterns.CreateEvent })
  async createEvent(@Payload() dto: CreateEventPayloadDto) {
    return this.eventService.createEvent(dto);
  }
}
