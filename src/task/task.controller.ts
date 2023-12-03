import { Controller, Get, Post, Body, Param, Delete, Put, Query, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('task')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.taskService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.taskService.findAll(req.user.id);
  }

  @Get('search')
  search(@Query('title') title: string, @Req() req) {
    return this.taskService.search(title, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.taskService.findOne(+id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
    return this.taskService.update(+id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.taskService.remove(+id, req.user.id);
  }

  @Post(':id/clock-in')
  clockIn(@Param('id') id: string) {
    return this.taskService.clockIn(+id);
  }

  @Post(':id/clock-out')
  clockOut(@Param('id') id: string) {
    return this.taskService.clockOut(+id);
  }

}
