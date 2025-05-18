import { Injectable } from '@nestjs/common';
import {
  AuthPatterns,
  EventPatterns,
  RewardPatterns,
  RewardClaimPatterns,
  AuthUser,
} from '@app/common';
import { CreateEventReqDto } from './dto/post.create-event.req.dto';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { CreateRewardReqDto } from './dto/post.create-reward.req.dto';
import { CreateRewardClaimReqDto } from './dto/post.create-reward-claim.req.dto';
import { RpcClientService } from './rpc-client/rpc-client.service';

@Injectable()
export class GatewayService {
  constructor(private rpcClientService: RpcClientService) {}

  getHello(): string {
    return `GW! ${process.env.PORT}`;
  }

  // auth
  async register(dto: RegisterReqDTO) {
    return await this.rpcClientService.send(AuthPatterns.Register, dto, 'auth');

    // return this.authClient.send({ cmd: AuthPatterns.Register }, dto);
  }

  async login(user: AuthUser) {
    const payload = user;
    return await this.rpcClientService.send(AuthPatterns.CreateAccessToken, payload, 'auth');

    // return this.authClient.send({ cmd: AuthPatterns.CreateAccessToken }, payload);
  }

  // event
  async createEvent(dto: CreateEventReqDto, user: AuthUser) {
    const { id } = user;

    // const payload: CreateEventPayloadDto = { ...dto, createdBy: id };
    const payload = { ...dto, createdBy: id };
    return await this.rpcClientService.send(EventPatterns.CreateEvent, payload, 'event');

    // return this.eventClient.send({ cmd: EventPatterns.CreateEvent }, payload);
  }

  async listEvents() {
    return await this.rpcClientService.send(EventPatterns.ListEvents, {}, 'event');

    // const result = this.eventClient.send({ cmd: EventPatterns.ListEvents }, {});
    // return result;
  }

  async getEventById(id: string) {
    const payload = { id }; // 24자 체크 필요

    return await this.rpcClientService.send(EventPatterns.GetEventById, payload, 'event');

    // const result = this.eventClient.send({ cmd: EventPatterns.GetEventById }, payload);
    // return result;
  }

  // reward
  async createReward(dto: CreateRewardReqDto, user: AuthUser) {
    const { id } = user;

    // const payload: CreateRewardPayloadDto = { ...dto, createdBy: id };
    const payload = { ...dto, createdBy: id };

    return await this.rpcClientService.send(RewardPatterns.CreateReward, payload, 'event');

    // return this.eventClient.send({ cmd: RewardPatterns.CreateReward }, payload);
  }

  async listRewards() {
    return await this.rpcClientService.send(RewardPatterns.ListRewards, {}, 'event');

    // const result = this.eventClient.send({ cmd: RewardPatterns.ListRewards }, {});
    // return result;
  }

  async getRewardById(id: string) {
    const payload = { id }; // 24자 체크 필요
    return await this.rpcClientService.send(RewardPatterns.GetRewardById, payload, 'event');

    // const result = this.eventClient.send({ cmd: RewardPatterns.GetRewardById }, payload);
    // return result;
  }

  // claim
  async createRewardClaim(dto: CreateRewardClaimReqDto, user: AuthUser) {
    const { id: userId, email: userEmail, nickname: userNickname } = user;
    const { rewardId } = dto;

    const payload = { rewardId, userId, userEmail, userNickname };
    return await this.rpcClientService.send(
      RewardClaimPatterns.CreateRewardClaim,
      payload,
      'event',
    );

    // const result = this.eventClient.send({ cmd: RewardClaimPatterns.CreateRewardClaim }, payload);
    // return result;
  }

  async listRewardClaims() {
    return await this.rpcClientService.send(RewardClaimPatterns.ListRewardClaims, {}, 'event');

    // const result = this.eventClient.send({ cmd: RewardClaimPatterns.ListRewardClaims }, {});
    // return result;
  }

  async getRewardClaimById(id: string) {
    return await this.sendEventRewardClaimMessage(id);
  }

  async listMyRewardClaims(user: AuthUser) {
    const { id } = user;
    const payload = { userId: id };

    return await this.rpcClientService.send(
      RewardClaimPatterns.ListRewardClaimsByUserId,
      payload,
      'event',
    );

    // const result = this.eventClient.send(
    //   { cmd: RewardClaimPatterns.ListRewardClaimsByUserId },
    //   payload,
    // );

    // return result;
  }

  async getMyRewardClaimById(id: string) {
    return await this.sendEventRewardClaimMessage(id);
  }

  private async sendEventRewardClaimMessage(claimId: string) {
    // 리소스 '소유권' 확인 필요??
    const payload = { id: claimId };
    return await this.rpcClientService.send(
      RewardClaimPatterns.GetRewardClaimById,
      payload,
      'event',
    );

    // const result = this.eventClient.send({ cmd: RewardClaimPatterns.GetRewardClaimById }, payload);
    // return result;
  }
}
