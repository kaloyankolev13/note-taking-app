import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
// import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly pepper: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.pepper = this.configService.get<string>('PASSWORD_SECRET');
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && (await this.comparePasswords(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltedPassword = password + this.pepper;
    return bcrypt.hash(saltedPassword, 10);
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const saltedPassword = password + this.pepper;
    return bcrypt.compare(saltedPassword, hashedPassword);
  }

  async register(data: any) {
    const { username, password, ...rest } = data;
    const hashedPassword = await this.hashPassword(password);
    return this.usersService.createUser({
      username,
      password: hashedPassword,
      ...rest,
    });
  }

  async login(user: any) {
    console.log(user);
    const payload = {
      username: user.username,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
