import { EventConditionCriteriaType } from 'apps/event/interfaces/event.condition-criteria.interface';

export interface EventConditionStrategy<T extends EventConditionCriteriaType> {
  validate(userId: string, criteria: T): Promise<boolean>;
}
