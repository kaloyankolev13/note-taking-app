import { Injectable } from '@nestjs/common';
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
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, projectId: string): Promise<Task> {
    // First, check if the project exists
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    console.log('hello');
    // Now create the task
    const newTask = new this.taskModel({
      ...createTaskDto,
      project: new Types.ObjectId(projectId), // Ensure projectId is converted to ObjectId
    });
    const task = await newTask.save();

    // Add task to the project
    await this.projectModel.findByIdAndUpdate(
      projectId,
      { $push: { tasks: task._id } },
      { new: true },
    );

    return task;
  }

  async findAll(projectId: string): Promise<Task[]> {
    console.log();
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    return this.taskModel.find({ project: projectId }).exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async remove(taskId: string): Promise<void> {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    await this.taskModel.findByIdAndDelete(taskId);

    await this.projectModel.findByIdAndUpdate(
      task.project,
      { $pull: { tasks: task._id } }, // Use $pull to remove the taskId from the array
      { new: true },
    );
  }
  async deleteAllInProject(projectId: string): Promise<void> {
    await this.taskModel.deleteMany({
      project: projectId,
    });
  }
}
