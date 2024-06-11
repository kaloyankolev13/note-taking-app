import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator'; // Import the custom User decorator

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post(':projectId')
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @User() user: any, // Use the custom User decorator
  ) {
    return this.taskService.create(createTaskDto, projectId, user.userId);
  }

  @Get(':projectId')
  findAll(@Param('projectId') projectId: string, @User() user: any) {
    return this.taskService.findAll(projectId, user.userId);
  }

  @Get('one/:id')
  findOne(@Param('id') id: string, @User() user: any) {
    return this.taskService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: any,
  ) {
    return this.taskService.update(id, updateTaskDto, user.userId);
  }

  @Delete(':taskId')
  remove(@Param('taskId') taskId: string, @User() user: any) {
    return this.taskService.remove(taskId, user.userId);
  }
}
