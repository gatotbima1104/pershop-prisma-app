import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Public } from './decorator/skip.auth';
import { Roles } from './decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  userRegister(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  userLogin(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Roles(Role.ADMIN)
  @Get('users')
  getUsers() {
    return this.authService.users();
  }

  // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
