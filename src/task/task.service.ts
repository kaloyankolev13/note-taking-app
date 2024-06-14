import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    projectId: string,
    userId: string,
  ): Promise<Task> {
    const project = await this.projectModel.findOne({
      _id: projectId,
      user: userId,
    });
    if (!project) {
      throw new UnauthorizedException(
        `Project with ID ${projectId} not found or you do not have access`,
      );
    }

    const newTask = new this.taskModel({
      ...createTaskDto,
      project: new Types.ObjectId(projectId),
      user: userId,
    });
    const task = await newTask.save();

    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $push: { tasks: task._id } },
      { new: true },
    );

    return task;
  }

  async findAll(projectId: string, userId: string): Promise<Task[]> {
    const project = await this.projectModel.findOne({
      _id: projectId,
      user: userId,
    });
    if (!project) {
      throw new UnauthorizedException(
        `Project with ID ${projectId} not found or you do not have access`,
      );
    }

    return this.taskModel.find({ project: projectId, user: userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, user: userId }).exec();
    if (!task) {
      throw new UnauthorizedException(
        `Task with ID ${id} not found or you do not have access`,
      );
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, user: userId }, updateTaskDto, { new: true })
      .exec();
    if (!task) {
      throw new UnauthorizedException(
        `Task with ID ${id} not found or you do not have access to update`,
      );
    }
    return task;
  }

  async remove(taskId: string, userId: string): Promise<void> {
    const task = await this.taskModel.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new UnauthorizedException(
        `Task with ID ${taskId} not found or you do not have access to delete`,
      );
    }

    await this.taskModel.findByIdAndDelete(taskId);

    await this.projectModel.findByIdAndUpdate(
      task.project,
      { $pull: { tasks: task._id } },
      { new: true },
    );
  }

  async deleteAllInProject(projectId: string, userId: string): Promise<void> {
    const project = await this.projectModel.findOne({
      _id: projectId,
      user: userId,
    });
    if (!project) {
      throw new UnauthorizedException(
        `Project with ID ${projectId} not found or you do not have access`,
      );
    }

    await this.taskModel
      .deleteMany({ project: projectId, user: userId })
      .exec();
  }
}
