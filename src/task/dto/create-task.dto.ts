// src/tasks/dto/create-task.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsMongoId()
  project?: mongoose.Types.ObjectId;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
