import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './jwt/jwt.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

    async register(dto: CreateUserDto){
        try {
            // cek duplicate username
            const duplicateUser = await this.prisma.user.findUnique({
                where: { 
                    username: dto.username
                }
            })

            if(duplicateUser){
                throw new HttpException({
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    message: 'username has been taken',
                },
                HttpStatus.UNPROCESSABLE_ENTITY
                )
            }

            const salt = await bcrypt.genSalt()

            const hashedPw = await bcrypt.hash(
                dto.password, salt
            )

            //create and hashed password
            const newUser = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    username: dto.username,
                    password: hashedPw
                }
            })
            
            //make payload for header user
            const payload: jwtPayload = {
                id: newUser.id,
                role: newUser.role
            }

            return {
                message: 'you are registered successfully',
                token: await this.jwtService.signAsync(payload)
            }
            
        } catch (error) {
            throw new HttpException({
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                data: {
                    message: error.message
                }
            },
            HttpStatus.UNPROCESSABLE_ENTITY
            )
        }

    }
    
    async login(dto: LoginUserDto){
        
        // check user in db
        const user = await this.prisma.user.findUnique({
            where:{
                username: dto.username
            }
        })

        if(!user){
            throw new HttpException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "User not found"
            },
            HttpStatus.NOT_FOUND
            )
        }

        // check password and username
        const isMatch = this.validatePassword(user.password, dto.password)

        if(isMatch){
            delete user.password

            const payload: jwtPayload = {
                id: user.id,
                role: user.role
            }

            return {
                user,
                token: await this.jwtService.signAsync(payload)
            }

        } throw new HttpException(
            'Username or Password is Incorrect',
            HttpStatus.UNAUTHORIZED
        )
    }

    async validatePassword(hashedPw: string, passsword: string){
        return await bcrypt.compare(hashedPw, passsword)
    }

    async users(){
        return await this.prisma.user.findMany()
    }
}
