import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { RegisterReqDTO } from 'apps/auth/src/auth/dto/post.register.req.dto';
import { AuthPatterns } from 'libs/constants/patterns/auth.patterns';
import { AUTH_SERVICE, EVENT_SERVICE } from 'libs/constants/tokens/service.tokens';
import { CreateEventReqDto } from './dto/post.create.event.req.dto';
import { User } from '../decorators/user.decorator';
import { AuthUser } from '../interfaces/auth-user.interface';
import { EventPatterns } from 'libs/constants/patterns/event.patterns';
import { CreateEventPayloadDto } from 'apps/event/src/event/dto/create.event.payload.dto';

@Injectable()
export class GatewayService {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(EVENT_SERVICE) private eventClient: ClientProxy,
  ) {}

  getHello(): string {
    return `GW! ${process.env.PORT}`;
  }

  // auth
  async register(dto: RegisterReqDTO) {
    return this.authClient.send({ cmd: AuthPatterns.Register }, dto);
  }

  async login(req) {
    const { id, email, role } = req;
    const payload = { id, email, role };

    return this.authClient.send({ cmd: AuthPatterns.CreateAccessToken }, payload);
  }

  // event
  async createEvent(dto: CreateEventReqDto, @User() user: AuthUser) {
    const { id } = user;

    const payload: CreateEventPayloadDto = { ...dto, createdBy: id };

    return this.eventClient.send({ cmd: EventPatterns.CreateEvent }, payload);
  }
}
