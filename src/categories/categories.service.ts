import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, CategoryDocument } from './schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
      ) {}

    async findAll(): Promise<Category[]> {
          return this.categoryModel.find();
        }
    async findById(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return category;
    }

    async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category> {
        const image = file ? file.path : null;

        const newCategory = new this.categoryModel({
          ...createCategoryDto,
          image
        });
        return newCategory.save();
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const updatedCategory = await this.categoryModel
          .findByIdAndUpdate(id, updateCategoryDto, { new: true })
          .exec();
        if (!updatedCategory) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedCategory;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return true;
      }
}
