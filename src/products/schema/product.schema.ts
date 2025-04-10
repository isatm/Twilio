import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as mongooseSchema} from 'mongoose';
import { Category } from 'src/categories/schema/category.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true})
export class Product{
    @Prop({required:true})
    name: string;

    @Prop({required:true})
    description: string;

    @Prop({required:true})
    price: string;

    @Prop({required:true})
    isActive: boolean;

    @Prop({type: mongooseSchema.Types.ObjectId, ref: Category.name, required: true })
    category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);