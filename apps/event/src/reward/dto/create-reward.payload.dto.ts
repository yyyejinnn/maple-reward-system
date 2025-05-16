export class CreateRewardPayloadDto {
  eventId: string;

  type: string;

  name: string;

  amount: number;

  meta?: Record<string, any>;

  createdBy: string;
}
