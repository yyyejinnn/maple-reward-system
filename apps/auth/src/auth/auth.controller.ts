import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'apps/auth/src/auth/guard/local.guard';
import { RegisterReqDTO } from './dto/post.register.req.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('/register')
  async register(@Body() dto: RegisterReqDTO) {
    return await this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const { user } = req; // deco 수정예정

    return this.authService.login(user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('test')
  async test(@Request() req) {
    return req.user;
  }
}
