import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const { title, status } = createTaskDto;
    const task = await this.prisma.task.create({
      data: {
        title,
        status,
        clockIn: new Date(),
        clockOut: new Date(),
        timeSpent: 0,
        userId: userId
      },
    });
    return task;
  }

  async findAll(userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
    });
    return tasks;
  }

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const { title, status } = updateTaskDto;

    const existingTask = await this.findOne(id, userId);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        status: status || existingTask.status,
      },
    });

    return updatedTask;
  }

  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);

    await this.prisma.task.delete({
      where: { id },
    });

    return task;
  }

  async search(title: string, userId: number) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        title: {
          contains: title,
        },
      },
    });

    return tasks;
  }

  async clockIn(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // if (task.clockIn) {
    //   throw new BadRequestException('Task already clocked in');
    // }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        clockIn: new Date(),
      },
    });

    return updatedTask;
  }

  async clockOut(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // if (!task.clockIn) {
    //   throw new BadRequestException('Task not clocked in');
    // }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        clockOut: new Date(),
        timeSpent: task.timeSpent + Math.floor((new Date().getTime() - task.clockIn.getTime()) / 1000),
      },
    });

    return updatedTask;
  }
}
