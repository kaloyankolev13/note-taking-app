import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  username: string;
  // @Prop()
  // field: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  // @Prop()
  // role: string;
  // @Prop()
  // position: string;
  // @Prop()
  // department: string;
  // @Prop()
  // contracts: Array<some kinda files>;
}

export const UserSchema = SchemaFactory.createForClass(User);
