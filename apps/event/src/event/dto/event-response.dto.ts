export class EventResponseDto {
  id: string;
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
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}
