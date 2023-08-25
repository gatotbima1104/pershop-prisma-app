import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService){}
    
    async insertProduct(dto: ProductDto){
        try {
            const product = await this.prisma.product.create({
                data: dto
            })
    
            return {
                product,
                message: 'product has been added successfully'
            }
            
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                throw new NotFoundException(`Name ${dto.name} has been taken`);
                }
            }            
            throw error
        }
    }

    async getAllProducts(){
        return await this.prisma.product.findMany()
    }

    async getProduct(id: string){
        const productById = await this.prisma.product.findUnique({
            where: {
                id,
            }
        })

        if(!productById){
            throw new NotFoundException('Product Not Found')
        }

        return productById
    }

    async updateProduct(id: string, dto: ProductDto){

        const product = await this.prisma.product.update({ 
            where: { 
                id,
            },
            data: {
                name: dto.name,
                price: dto.price
            }
        })

        if(!product){
            throw new NotFoundException('product not found')
        }

        return{
            product,
            message: 'product has been updated successfully'
        }
    }

    async removeProductById(id: string){
        const productById = await this.prisma.product.delete({
            where:{
                id,
            }
        })

        return{
            message: 'product has been deleted successfully'
        }

    }

}
