import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';

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
    // Check if the project exists
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Return all tasks for the given project ID
    return this.taskModel.find({ project: projectId }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async remove(taskId: string): Promise<void> {
    console.log(taskId);
    // First, find the task to get the projectId
    const task = await this.taskModel.findById(taskId);
    console.log(task);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    // Remove the task
    await this.taskModel.findByIdAndDelete(taskId);

    // Update the project to remove the task ID from the tasks array
    await this.projectModel.findByIdAndUpdate(
      task.project,
      { $pull: { tasks: task._id } }, // Use $pull to remove the taskId from the array
      { new: true },
    );
  }
}
