export class CreateEventReqDto {
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
}
