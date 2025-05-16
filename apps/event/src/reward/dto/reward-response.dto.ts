export class RewardResponseDto {
  id: string;
  type: string;
  name: string;
  amount: number;
  event: {
    id: string;
    title: string;
    isActive: boolean;
    period: {
      start: Date;
      end: Date;
    };
  };
  createdBy: string;
  createdAt: Date;
}
