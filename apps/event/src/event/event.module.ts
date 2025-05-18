import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'apps/event/src/schemas/event.schema';
import { EventConditionStrategyModule } from '@app/common/strategies/event-condition.strategy.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    EventConditionStrategyModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
