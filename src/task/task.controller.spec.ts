import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  let mockTaskService: Partial<TaskService>;

  beforeEach(async () => {
    mockTaskService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  describe('create', () => {
    it('should call taskService.create with the right parameters', async () => {
      const projectId = 'proj123';
      const createTaskDto = { title: 'Task 1', content: 'Do something' };
      controller.create(projectId, createTaskDto);
      expect(mockTaskService.create).toHaveBeenCalledWith(
        createTaskDto,
        projectId,
      );
    });
  });

  describe('findAll', () => {
    it('should call taskService.findAll with the right project id', async () => {
      const projectId = 'proj123';
      controller.findAll(projectId);
      expect(mockTaskService.findAll).toHaveBeenCalledWith(projectId);
    });
  });

  describe('findOne', () => {
    it('should call taskService.findOne with the right id', async () => {
      const taskId = 'task123';
      controller.findOne(taskId);
      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
    });
  });

  describe('remove', () => {
    it('should call taskService.remove with the right task id', async () => {
      const taskId = 'task123';
      controller.remove(taskId);

      expect(mockTaskService.remove).toHaveBeenCalledWith(taskId);
    });
  });
});
