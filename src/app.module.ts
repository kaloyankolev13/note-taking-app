import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ProjectModule,
    TaskModule,
    MongooseModule.forRoot('mongodb://localhost:27017/note-app'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
