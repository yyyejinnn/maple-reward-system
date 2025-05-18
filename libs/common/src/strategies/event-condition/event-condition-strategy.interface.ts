import { EventType } from '@app/common';
import { EventConditionCriteriaMap } from '@app/common/interfaces/event-criteria-map.type';

export interface EventConditionStrategy<T extends EventType> {
  validate(userId: string, criteria: EventConditionCriteriaMap[T]): Promise<boolean>;

  validateStructure(criteria: object): {
    valid: boolean;
    cause?: string;
  };
}
