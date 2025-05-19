import { RewardClaimProgress } from '@app/common';

export interface BaseRewardClaimFilterQuery {
  eventId?: string;
  userId?: string;
  progress?: RewardClaimProgress;
}
