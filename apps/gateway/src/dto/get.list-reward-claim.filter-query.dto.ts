import { BaseRewardClaimFilterQuery, RewardClaimProgress } from '@app/common';

export class RewardClaimFilterQueryDto implements BaseRewardClaimFilterQuery {
  eventId?: string;
  userId?: string;
  progress?: RewardClaimProgress;
}
