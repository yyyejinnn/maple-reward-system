export type EventConditionCriteriaType =
  | LoginDaysCriteria
  | InviteCountCriteria
  | LevelReachedCriteria;

export interface LoginDaysCriteria {
  days: number;
}

export interface InviteCountCriteria {
  count: number;
}

export interface LevelReachedCriteria {
  minLevel: number;
}
