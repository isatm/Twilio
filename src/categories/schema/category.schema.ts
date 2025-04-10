import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as mongooseSchema} from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true})
export class Category{
    @Prop({required:true})
    name: string;

    @Prop({required:true})
    description: string;

    @Prop({required:true})
    isActive: boolean;

    @Prop({required:true})
    image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);