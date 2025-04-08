import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
  import { RolesGuard } from '../users/guards/roles.guard';
  import { Roles } from '../users/decorators/roles.decorator';
  import { Public } from '../users/decorators/public.decorator';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    // Ruta pública utilizando el decorador Public
    @Public()
    @Get()
    findAll() {
      return this.productsService.findAll();
    }
  
    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.productsService.findById(id);
    }
  
    // Ruta protegida por defecto
    @Post()
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
      return this.productsService.create(createProductDto, req.user.id);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto,
      @Request() req,
    ) {
      const product = await this.productsService.findById(id);
      if (product.createdBy && product.createdBy.toString() !== req.user.id) {
        throw new UnauthorizedException('You can only update your own products');
      }
      return this.productsService.update(id, updateProductDto);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req) {
      const product = await this.productsService.findById(id);
      if (
        product.createdBy &&
        product.createdBy.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        throw new UnauthorizedException(
          'You can only delete your own products',
        );
      }
      return this.productsService.delete(id);
    }
  
    // Ruta protegida solo para roles específicos
    @UseGuards(RolesGuard) 
    @Roles('admin')
    @Get('admin/all')
    findAllAdmin() {
      return this.productsService.findAll();
    }
  }