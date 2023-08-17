import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Get()
    getAllProducts(){
        return this.productService.getAllProducts()
    }

    @Get(':id')
    getProductById(@Param('id') id: string){
        return this.productService.getProduct(parseInt(id))
    }

    @Post()
    insertProduct(@Body() dto: ProductDto){
        return this.productService.insertProduct(dto)
    }

    @Patch(':id')
    updateProduct(@Param('id') id: string, @Body() dto: ProductDto){
        return this.productService.updateProduct(parseInt(id), dto)
    }

    @Delete(':id')
    removeProduct(@Param('id') id: string){
        return this.productService.removeProductById(parseInt(id))
    }

}
