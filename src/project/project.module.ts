// src/projects/projects.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { TaskService } from '../task/task.service';
import { TaskModule } from 'src/task/task.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => TaskModule),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, TaskService, JwtService],
  exports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
})
export class ProjectModule {}
