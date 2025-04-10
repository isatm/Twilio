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
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { CategoriesService } from './categories.service';
  import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
  import { RolesGuard } from '../users/guards/roles.guard';
  import { Roles } from '../users/decorators/roles.decorator';
  import { Public } from '../users/decorators/public.decorator';
  import {FileInterceptor} from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    
    @Public()
    @Get()
    findAll() {
      return this.categoriesService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.categoriesService.findById(id);
    }

     @Public()
     @Post()
     @UseInterceptors(FileInterceptor('file'))
        create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: Express.Multer.File) {
          return this.categoriesService.create(createCategoryDto, file);
    }

    @Put(':id')
        async update(
            @Param('id') id: string,
            @Body() updateCategoryDto: UpdateCategoryDto,
            @Request() req,
        ) {
            const category = await this.categoriesService.findById(id);
            /*
            if (category.createdBy && category.createdBy.toString() !== req.user.id) {
            throw new UnauthorizedException('You can only update your own products');
            }*/
            return this.categoriesService.update(id, updateCategoryDto);
    }
      
    @Delete(':id')
        async delete(@Param('id') id: string, @Request() req) {
          const category = await this.categoriesService.findById(id);
          /*
          if (
            category.createdBy &&
            category.createdBy.toString() !== req.user.id &&
            req.user.role !== 'admin'
          ) {
            throw new UnauthorizedException(
              'You can only delete your own products',
            );
          }
          */
          return this.categoriesService.delete(id);
    }
    // Ruta protegida solo para roles específicos
    @UseGuards(RolesGuard) 
    @Roles('admin','editor')
    @Get('admin/all')
    findAllAdmin() {
        return this.categoriesService.findAll();
    }
}
