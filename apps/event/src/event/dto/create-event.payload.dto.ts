import { CreateEventReqDto } from 'apps/gateway/src/dto/post.create.event.req.dto';

export class CreateEventPayloadDto extends CreateEventReqDto {
  createdBy: string;
}
