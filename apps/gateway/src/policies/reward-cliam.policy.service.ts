import { AuthUser, UserRole } from '@app/common';
import { BadRequestException, ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { RewardClaim } from 'apps/event/src/schemas/reward-claim.schema';

@Injectable()
export class RewardClaimPolicyService {
  assertViewOwnerClaim(user: AuthUser, claim: RewardClaim) {
    if (!user || !claim) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    const { id: reqUserId, role } = user;
    const { userId: claimUserId } = claim;

    if (role !== UserRole.USER || reqUserId !== claimUserId) {
      throw new ForbiddenException('본인만 접근할 수 있습니다.');
    }
  }
}
