export class CreateRewardReqDto {
  eventId: string;

  type: string;

  name: string;

  amount: number;

  meta?: Record<string, any>;
}
