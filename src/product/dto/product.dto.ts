import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class ProductDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsNumber()
    @IsNotEmpty()
    stock: number
}