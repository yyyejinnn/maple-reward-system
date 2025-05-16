import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { LocalAuthGuard } from 'apps/gateway/guard/local.guard';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { CreateEventReqDto } from './dto/post.create.event.req.dto';
import { User } from '../decorators/user.decorator';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RegisterReqDTO } from './dto/post.register.req.dto';

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

  // event
  @UseGuards(JwtAuthGuard)
  @Post('/events')
  async createEvent(@Body() dto: CreateEventReqDto, @User() user: AuthUser) {
    console.log(user);
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
}
