import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/auth/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'apps/gateway/strategy/local.strategy';
import { JwtStrategy } from 'apps/gateway/strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_SECRET_KEY } from 'libs/constants/tokens/jwt.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get(JWT_SECRET_KEY),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
