import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create.user.dto';
import mongoose from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new HttpException('User not found', 404);

    const user = await this.usersService.getUser(id);

    if (!user) throw new HttpException('User not found', 404);

    return user;
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }
  @Post()
  createUser(@Body() data: CreateUserDTO) {
    return this.authService.register(data);
  }
}
