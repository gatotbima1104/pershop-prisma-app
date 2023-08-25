import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    
    @Get('profile')
    getProfile(@Req() req) {
    return req.user;
    }
}
