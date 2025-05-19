import { BaseRewardClaimFilterQuery, RewardClaimProgress } from '@app/common';

export class RewardClaimsFilterQueryDto implements BaseRewardClaimFilterQuery {
  eventId?: string;
  userId?: string;
  progress?: RewardClaimProgress;
}
