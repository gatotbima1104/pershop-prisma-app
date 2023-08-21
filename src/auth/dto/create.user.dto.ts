import { IsNotEmpty, IsString } from "class-validator"
import { Role } from "../enum/role.enum"

export class CreateUserDto{
    @IsString()
    name:string

    @IsString()
    @IsNotEmpty()
    username:string

    @IsString()
    @IsNotEmpty()
    password:string

    roles: Role[]
}