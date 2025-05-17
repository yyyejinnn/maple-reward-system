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
import { CreateRewardClaimReqDto } from './dto/post.create-reward-claim.req.dto';
import { RewardClaimPatterns } from 'libs/constants/patterns/reward-claim.patterns';

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

  // claim
  async createRewardClaim(dto: CreateRewardClaimReqDto, user: AuthUser) {
    const { id: userId, email: userEmail, nickname: userNickname } = user;
    const { rewardId } = dto;

    const payload = { rewardId, userId, userEmail, userNickname };
    const result = this.eventClient.send({ cmd: RewardClaimPatterns.CreateRewardClaim }, payload);

    return result;
  }

  async listRewardClaims() {
    const result = this.eventClient.send({ cmd: RewardClaimPatterns.ListRewardClaims }, {});

    return result;
  }

  async getRewardClaimById(id: string) {
    return this.sendEventRewardClaimMessage(id);
  }

  async listMyRewardClaims(user: AuthUser) {
    const { id } = user;
    const payload = { userId: id };

    const result = this.eventClient.send(
      { cmd: RewardClaimPatterns.ListRewardClaimsByUserId },
      payload,
    );

    return result;
  }

  async getMyRewardClaimById(id: string) {
    return this.sendEventRewardClaimMessage(id);
  }

  private sendEventRewardClaimMessage(claimId: string) {
    // 리소스 '소유권' 확인 필요??
    const payload = { id: claimId };
    const result = this.eventClient.send({ cmd: RewardClaimPatterns.GetRewardClaimById }, payload);

    return result;
  }
}
