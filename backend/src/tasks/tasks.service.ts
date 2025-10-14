import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Create task
  async create(userId: number, dto: CreateTaskDto) {
    // Admin can assign to any user; regular users assigned to self
    const assignedUserId = dto.userId || userId;

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'todo',
        priority: dto.priority || 'Low',
        userId: assignedUserId,
      },
      include: { user: true }, // include assigned user info
    });
  }

  // Find all tasks
  async findAll(user: { id: number; role: string }) {
    if (user.role === 'admin') {
      return this.prisma.task.findMany({ include: { user: true } });
    }
    return this.prisma.task.findMany({
      where: { userId: user.id },
      include: { user: true },
    });
  }

  // Find one task
  async findOne(id: number, user: { id: number; role: string }) {
    const task = await this.prisma.task.findUnique({ where: { id }, include: { user: true } });
    if (!task) throw new NotFoundException('Task not found');
    if (user.role !== 'admin' && task.userId !== user.id)
      throw new ForbiddenException('Access denied');
    return task;
  }

  // Update task
  async update(id: number, user: { id: number; role: string }, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    // Only admin can update tasks not owned by them
    if (user.role !== 'admin' && task.userId !== user.id)
      throw new ForbiddenException('You cannot update this task');

    const assignedUserId = user.role === 'admin' ? dto.userId || task.userId : task.userId;

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title || task.title,
        description: dto.description || task.description,
        status: dto.status || task.status,
        priority: dto.priority || task.priority,
        userId: assignedUserId,
      },
      include: { user: true },
    });
  }

  // Delete task
  async remove(id: number, user: { id: number; role: string }) {
    if (user.role !== 'admin') throw new ForbiddenException('Only admin can delete');

    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    await this.prisma.task.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
