import { RewardType } from '@app/common';

export class CreateRewardPayloadDto {
  eventId: string;
  type: RewardType;
  name: string;
  amount: number;
  meta?: Record<string, any>;
  createdBy: string;
}
