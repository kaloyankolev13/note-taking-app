import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TaskDocument = Document & Task;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string; // A title for the note for easy identification

  @Prop({ required: true })
  content: string; // The main content of the note

  @Prop()
  createdAt: Date; // Timestamp for when the note was created

  @Prop()
  updatedAt: Date; // Timestamp for when the note was last updated

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: mongoose.Types.ObjectId; // Reference to the Project this note belongs to

  @Prop([String])
  tags: string[]; // An array of tags for categorization and searching
}

export const TaskSchema = SchemaFactory.createForClass(Task);
