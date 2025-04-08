import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  isArchive: boolean;
}

export class UpdateCategoryDto{
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsBoolean()
    isArchive?: boolean;
}