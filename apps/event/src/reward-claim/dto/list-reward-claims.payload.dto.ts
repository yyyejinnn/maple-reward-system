import { BaseRewardClaimFilterQuery, RewardClaimProgress } from '@app/common';

export class RewardClaimFilteredQuery implements BaseRewardClaimFilterQuery {
  eventId?: string;
  userId?: string;
  progress?: RewardClaimProgress;
}

export class ListRewardClaimsPayloadDto {
  query?: RewardClaimFilteredQuery;
}
