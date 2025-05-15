import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterReqDTO } from 'apps/auth/src/auth/dto/post.register.req.dto';
import { AuthPatterns } from 'libs/constants/patterns/auth.patterns';
import { AUTH_SERVICE, EVENT_SERVICE } from 'libs/constants/tokens/service.tokens';

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
}
