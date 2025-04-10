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
  
  @IsOptional()
  @IsBoolean()
  isArchive: boolean;
}

export class UpdateCategoryDto{
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsNotEmpty()
    @IsString()
    description?: string;
    
    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsBoolean()
    isArchive?: boolean;
}