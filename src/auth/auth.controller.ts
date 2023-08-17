import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    userRegister(@Body() dto: CreateUserDto){
        return this.authService.register(dto)
    }

    @Get('users')
    getUsers(){
        return this.authService.users()
    }

    @Post('login')
    userLogin(@Body() dto: LoginUserDto){
        return this.authService.login(dto)
    }

}
