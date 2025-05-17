import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  EVENT_SERVICE,
  AuthPatterns,
  EventPatterns,
  RewardPatterns,
  RewardClaimPatterns,
} from '@app/common';
import { CreateEventReqDto } from './dto/post.create-event.req.dto';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { CreateRewardReqDto } from './dto/post.create-reward.req.dto';
import { CreateRewardClaimReqDto } from './dto/post.create-reward-claim.req.dto';

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

    // const payload: CreateEventPayloadDto = { ...dto, createdBy: id };
    const payload = { ...dto, createdBy: id };

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

    // const payload: CreateRewardPayloadDto = { ...dto, createdBy: id };
    const payload = { ...dto, createdBy: id };

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
