import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { AuthPatterns } from 'libs/constants/patterns/auth.patterns';
import { AUTH_SERVICE, EVENT_SERVICE } from 'libs/constants/tokens/service.tokens';
import { CreateEventReqDto } from './dto/post.create-event.req.dto';
import { AuthUser } from '../interfaces/auth-user.interface';
import { EventPatterns } from 'libs/constants/patterns/event.patterns';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { RewardPatterns } from 'libs/constants/patterns/reward.patterns';
import { CreateRewardReqDto } from './dto/post.create-reward.req.dto';
import { CreateEventPayloadDto } from 'apps/event/src/event/dto/create-event.payload.dto';
import { CreateRewardPayloadDto } from 'apps/event/src/reward/dto/create-reward.payload.dto';

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

  async login(user: AuthUser) {
    const payload = user;

    return this.authClient.send({ cmd: AuthPatterns.CreateAccessToken }, payload);
  }

  // event
  async createEvent(dto: CreateEventReqDto, user: AuthUser) {
    const { id } = user;

    const payload: CreateEventPayloadDto = { ...dto, createdBy: id };

    return this.eventClient.send({ cmd: EventPatterns.CreateEvent }, payload);
  }

  async listEvents() {
    const result = this.eventClient.send({ cmd: EventPatterns.ListEvents }, {});

    return result;
  }

  async getEventById(id: string) {
    const payload = { id }; // 24자 체크 필요
    const result = this.eventClient.send({ cmd: EventPatterns.GetEventById }, payload);

    return result;
  }

  // reward
  async createReward(dto: CreateRewardReqDto, user: AuthUser) {
    const { id } = user;
    const payload: CreateRewardPayloadDto = { ...dto, createdBy: id };

    return this.eventClient.send({ cmd: RewardPatterns.CreateReward }, payload);
  }

  async listRewards() {
    const result = this.eventClient.send({ cmd: RewardPatterns.ListRewards }, {});

    return result;
  }

  async getRewardById(id: string) {
    const payload = { id }; // 24자 체크 필요
    const result = this.eventClient.send({ cmd: RewardPatterns.GetRewardById }, payload);

    return result;
  }
}
