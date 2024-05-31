import { Logger, Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        Logger.log(`Connecting to MongoDB at ${uri}`);
        return {
          uri,
          connectTimeoutMS: 30000, // Increase timeout to 30 seconds
        };
      },
      inject: [ConfigService],
    }),
    TaskModule,
    UsersModule,
    AuthModule,
    ProjectModule,
  ],
})
export class AppModule {}
