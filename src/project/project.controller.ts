import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator'; // Import the custom User decorator

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @User() user: any) {
    createProjectDto.user = user.userId;
    return this.projectService.create(createProjectDto);
  }

  @Get()
  async findAll(@User() user: any) {
    return this.projectService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: any) {
    return this.projectService.findOne(id, user.userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @User() user: any,
  ) {
    return this.projectService.update(id, updateProjectDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.projectService.remove(id, user.userId);
  }
}
