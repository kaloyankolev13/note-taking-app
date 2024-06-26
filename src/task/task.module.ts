import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from '../schemas/task.schema';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    forwardRef(() => ProjectModule),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [
    TaskService,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
})
export class TaskModule {}
