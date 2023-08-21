import { ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

    async register(dto: CreateUserDto){
        try {
            const hashedPassword = await argon.hash(dto.password)
    
            const newUser = await this.prisma.user.create({
                data: {
                    // id: uuidv4(),
                    name: dto.name,
                    username: dto.username,
                    password: hashedPassword
                }
            })
    
            delete newUser.password
            
            return {
                user: newUser,
                message: 'User Registered'
            }
            
        } catch (error) {

            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                throw new ForbiddenException('Username has been taken');
                }
            }            
            throw error
            
        }

    }

    async users(){
        return await this.prisma.user.findMany()
    }

    async login(dto: LoginUserDto){
        const user = await this.prisma.user.findUnique({
            where:{
                username: dto.username
            }
        })

        if(!user){
            throw new NotFoundException('Username is Incorrect')
        }

        const isMatch = await argon.verify(user.password, dto.password)

        if(!isMatch){
            throw new NotFoundException('Password is Incorrect')
        }

        delete user.password

        const payload = {
            sub: user.id,
            username: user.username
        }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }

        // return ({ 
        //     user,
        //     message: 'Login successfully'
        // })
    }
}
