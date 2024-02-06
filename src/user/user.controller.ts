/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { ParamId } from 'src/decorators/param-id.decorator';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async show(@ParamId() id) {
    return this.userService.show(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Body() data: UpdatePutUserDTO, @ParamId() id) {
    return this.userService.update(id, data);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async upadatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id) {
    return this.userService.updatePartial(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@ParamId() id) {
    return this.userService.delete(id);
  }
}
