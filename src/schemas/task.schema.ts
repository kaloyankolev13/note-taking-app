import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Task {
  @Prop({ required: true })
  title: string; // A title for the note for easy identification

  @Prop({ required: true })
  content: string; // The main content of the note

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: mongoose.Types.ObjectId; // Reference to the Project this note belongs to

  @Prop([String])
  tags: string[]; // An array of tags for categorization and searching

  @Prop({
    required: true,
    enum: ['Backlog', 'In Progress', 'Completed', 'Archived'],
  })
  status: string; // The status of the note

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export type TaskDocument = Task & Document;
