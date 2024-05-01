import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from '../schemas/project.schema';

const mockProject: Project = {
  title: 'Sample Project',
  tasks: [], // Assuming there's a tasks array
};

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    // Mock ProjectService
    const mockProjectService = {
      create: jest.fn((dto) => dto),
      findAll: jest.fn(() => []),
      findOne: jest.fn((id) => ({ id })),
      update: jest.fn((id, dto) => ({ id, ...dto })),
      remove: jest.fn((id) => ({ id })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });

  it('should create a new project', async () => {
    const createProjectDto = {
      title: 'New Project',
      description: 'Test project',
      tasks: [],
    };
    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(createProjectDto));

    expect(await controller.create(createProjectDto)).toBe(createProjectDto);
  });

  it('should return an array of projects', async () => {
    const result = [];
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.findAll()).toBe(result);
  });

  it('should return a single project', async () => {
    const id = '1';
    const project = {
      id,
      title: 'Existing Project',
      description: 'Description',
      tasks: [],
    };
    jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(project));

    expect(await controller.findOne(id)).toBe(project);
  });

  it('should update a project', async () => {
    const id = '1';
    const updateProjectDto = { title: 'Updated Title', tasks: [] };
    const updatedProject = { id, ...updateProjectDto };
    jest
      .spyOn(service, 'update')
      .mockImplementation(() => Promise.resolve(updatedProject));

    expect(await controller.update(id, updateProjectDto)).toBe(updatedProject);
  });

  it('should remove the project', async () => {
    const id = '1';
    jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve(mockProject));

    expect(await controller.remove(id)).toEqual(mockProject);
  });
});
