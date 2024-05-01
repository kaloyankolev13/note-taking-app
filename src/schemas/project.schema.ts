import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Task } from './task.schema'; // assuming you have a Note schema defined

export type ProjectDocument = Document & Project;

@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  })
  notes: Task[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
