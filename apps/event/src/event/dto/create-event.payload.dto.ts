import { EventCondition, EventType } from '@app/common';
import { EventPeriod } from '@app/common/interfaces/event-period.interface';

export class CreateEventPayloadDto<T extends EventType = EventType> {
  title: string;
  description?: string;

  condition: EventCondition<T>;

  period: EventPeriod;
  isActive: boolean;
  createdBy: string;
}
