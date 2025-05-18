import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';

import { CreateEventReqDto } from './dto/post.create-event.req.dto';
import { RegisterReqDTO } from './dto/post.register.req.dto';
import { CreateRewardReqDto } from './dto/post.create-reward.req.dto';
import { CreateRewardClaimReqDto } from './dto/post.create-reward-claim.req.dto';
import { JwtAuthGuard } from './passport/jwt/jwt.guard';
import { LocalAuthGuard } from './passport/local/local.guard';
import { User } from './decorators/user.decorator';
import { AuthUser } from '@app/common';
import { Roles } from './role/role.decorator';
import { UserRole } from '@app/common/enums/user-role.enum';

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
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
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
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
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
  @Roles(UserRole.USER)
  @Post('/reward-claims')
  async createRewardClaim(@Body() dto: CreateRewardClaimReqDto, @User() user: AuthUser) {
    return await this.gatewayService.createRewardClaim(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN, UserRole.AUDITOR)
  @Get('/reward-claims')
  async listRewardClaims() {
    return this.gatewayService.listRewardClaims();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN, UserRole.AUDITOR)
  @Get('/reward-claims/:id')
  async getRewardClaimById(@Param('id') id: string) {
    return this.gatewayService.getRewardClaimById(id);
  }

  // 유저용
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.USER)
  async listMyRewardClaims(@User() user: AuthUser) {
    // 소유권 확인 필요
    return this.gatewayService.listMyRewardClaims(user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.USER)
  @Get('/my/reward-claims/:id')
  async getMyRewardClaimById(@Param('id') id: string, @User() user: AuthUser) {
    // 소유권 확인 필요
    return this.gatewayService.getMyRewardClaimById(id);
  }
}
