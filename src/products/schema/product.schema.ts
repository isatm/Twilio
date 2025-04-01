import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as mongooseSchema} from 'mongoose';

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
    isActive: string;

    @Prop({required:true})
    role: string;

    @Prop({type: mongooseSchema.Types.ObjectId, ref:'User'})
    createdBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);