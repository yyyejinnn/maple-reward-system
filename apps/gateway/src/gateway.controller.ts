import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { LocalAuthGuard } from 'apps/gateway/guard/local.guard';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { CreateEventReqDto } from './dto/post.create-event.req.dto';
import { User } from '../decorators/user.decorator';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { CreateRewardReqDto } from './dto/post.create-reward.req.dto';
import { CreateRewardClaimReqDto } from './dto/post.create-reward-claim.req.dto';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('/test')
  @UseGuards(JwtAuthGuard)
  test(): string {
    return this.gatewayService.getHello();
  }

  //auth
  @Post('/auth/register')
  async register(@Body() dto: RegisterReqDTO) {
    return await this.gatewayService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@User() user: AuthUser) {
    return await this.gatewayService.login(user);
  }

  // event - events
  @UseGuards(JwtAuthGuard)
  @Post('/events')
  async createEvent(@Body() dto: CreateEventReqDto, @User() user: AuthUser) {
    // 후에 보상 등록 로직 필요
    return await this.gatewayService.createEvent(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/events')
  async listEvents() {
    return await this.gatewayService.listEvents();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/events/:id')
  async getEventById(@Param('id') id: string) {
    return this.gatewayService.getEventById(id);
  }

  // event - rewards
  @UseGuards(JwtAuthGuard)
  @Post('/rewards')
  async createReward(@Body() dto: CreateRewardReqDto, @User() user: AuthUser) {
    return await this.gatewayService.createReward(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rewards')
  async listRewards() {
    return await this.gatewayService.listRewards();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rewards/:id')
  async getRewardById(@Param('id') id: string) {
    return this.gatewayService.getRewardById(id);
  }

  // event - claims
  @UseGuards(JwtAuthGuard)
  @Post('/reward-claims')
  async createRewardCliam(@Body() dto: CreateRewardClaimReqDto, @User() user: AuthUser) {
    return await this.gatewayService.createRewardCliam(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/reward-claims')
  async listRewardClaims() {
    return this.gatewayService.listRewardClaims();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/reward-claims/:id')
  async getRewardClaimById(@Param('id') id: string) {
    return this.gatewayService.getRewardClaimById(id);
  }

  // 유저용
  @UseGuards(JwtAuthGuard)
  @Get('/my/reward-claims')
  async getMyRewardClaim(@User() user: AuthUser) {
    return this.gatewayService.getMyRewardClaim(user);
  }
}
