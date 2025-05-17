import { EventType } from '@app/common';
import { EventConditionCriteriaMap } from '@app/common/interfaces/event-criteria-map.type';

export class CreateEventPayloadDto<T extends EventType = EventType> {
  title: string;
  description?: string;

  condition: {
    type: T;
    criteria: EventConditionCriteriaMap[T];
  };

  period: {
    start: Date;
    end: Date;
  };

  createdBy: string;
}
