import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from '../schemas/project.schema';
import { TaskService } from '../task/task.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private taskService: TaskService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = new this.projectModel(createProjectDto);
    console.log(newProject);
    return newProject.save();
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectModel.find({ user: userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({ _id: id, user: userId })
      .exec();
    if (!project) {
      throw new UnauthorizedException(
        'You do not have access to this project.',
      );
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectModel
      .findOneAndUpdate({ _id: id, user: userId }, updateProjectDto, {
        new: true,
      })
      .exec();
    if (!project) {
      throw new UnauthorizedException(
        'You do not have access to update this project.',
      );
    }
    return project;
  }

  async remove(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();
    if (!project) {
      throw new UnauthorizedException(
        'You do not have access to delete this project.',
      );
    }
    await this.taskService.deleteAllInProject(id, userId);
    return project;
  }
}
