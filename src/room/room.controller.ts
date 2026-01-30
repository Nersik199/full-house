import { Auth } from 'src/auth/decorators/auth.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomCreateDto } from './dto/room.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth('bearer-Token')
  @Auth()
  @Post('create')
  async create(@CurrentUser('id') userId: number, @Body() dto: RoomCreateDto) {
    return await this.roomService.create(dto);
  }

  @Get('all')
  async findAll() {
    return await this.roomService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.roomService.findById(id);
  }

  @ApiBearerAuth('bearer-Token')
  @Auth()
  @Put('update/:id')
  async update(@Body() dto: RoomCreateDto, @Param('id') id: number) {
    return await this.roomService.update(id, dto);
  }

  @ApiBearerAuth('bearer-Token')
  @Auth()
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.roomService.delete(id);
  }

  @Get('search')
  async search() {}
}
