import { EventType } from '../enums/event-type.enum';
import { EventConditionCriteriaMap } from './event-criteria-map.type';

export interface EventCondition<T extends EventType = EventType> {
  type: T;
  criteria: EventConditionCriteriaMap[T];
}
