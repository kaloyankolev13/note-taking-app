import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TaskModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ProjectModule,
    MongooseModule.forRoot('mongodb://localhost:27017/note-app'),
  ],
})
export class AppModule {}
