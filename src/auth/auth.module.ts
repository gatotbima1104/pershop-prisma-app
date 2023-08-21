import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from './jwt.constant';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: {expiresIn: '1h'}
  })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
