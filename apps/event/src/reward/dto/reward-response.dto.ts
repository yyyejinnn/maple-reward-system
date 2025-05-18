import { EventPeriod } from '@app/common/interfaces/event-period.interface';

export class RewardResponseDto {
  id: string;
  type: string;
  name: string;
  amount: number;
  event: {
    id: string;
    title: string;
    isActive: boolean;
    period: EventPeriod;
  };
  createdBy: string;
  createdAt: Date;
}
