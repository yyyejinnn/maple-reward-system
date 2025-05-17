import { EventType } from '../enums/event-type.enum';
import { InviteCountCriteria } from './event-condition/invite-count-criteria.interface';
import { LevelReachedCriteria } from './event-condition/level-reached-criteria.interface';
import { LoginDaysCriteria } from './event-condition/login-days-criteria.interface';

export type EventConditionCriteriaMap = {
  [EventType.LOGIN_DAYS]: LoginDaysCriteria;
  [EventType.INVITE_COUNT]: InviteCountCriteria;
  [EventType.LEVEL_REACHED]: LevelReachedCriteria;
};
