import { BaseRewardClaimFilterQuery, RewardClaimProgress } from '@app/common';

export class MyRewardClaimsFilterQueryDto implements BaseRewardClaimFilterQuery {
  eventId?: string;
  progress?: RewardClaimProgress;
}
