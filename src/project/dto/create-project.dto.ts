import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  tasks: string[];

  @IsString()
  @IsNotEmpty()
  user: string;
}
