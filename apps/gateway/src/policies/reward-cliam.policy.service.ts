import { AuthUser, UserRole } from '@app/common';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class RewardClaimPolicyService {
  assertViewOwnerClaim(user: AuthUser, claim: any) {
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
