import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategorySchema } from './schema/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([
      {name: 'Category', schema:CategorySchema}
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}