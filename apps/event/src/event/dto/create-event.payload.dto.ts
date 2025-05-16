export class CreateEventPayloadDto {
  title: string;
  description?: string;

  condition: {
    type: string;
    criteria: Record<string, any>;
  };

  period: {
    start: Date;
    end: Date;
  };

  createdBy: string;
}
