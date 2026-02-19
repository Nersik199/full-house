import { Auth } from 'src/auth/decorators/auth.decorators';
import {
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomCreateDto, RoomUpdateDto } from './dto/room.dto';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { CurrentAdmin } from 'src/user/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HeaderRoomCreateDto, HeaderRoomUpdateDto } from './dto/header.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create/header')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: HeaderRoomCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.roomService.createHeader(dto, file);
  }

  @ApiQuery({
    name: 'urlId',
    required: false,
    type: String,
  })
  @ApiBearerAuth('Authorization')
  @Auth()
  @Put('admin/update/header/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async updateHeader(
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @CurrentAdmin('id') userId: number,
    @Body() dto: HeaderRoomUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.roomService.updateHeader(id, urlId, dto, file);
  }

  @Get('header/info')
  @HttpCode(HttpStatus.OK)
  async getHeader() {
    return await this.roomService.getHeader();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  async create(
    @CurrentAdmin('role') role: string,
    @Body() dto: RoomCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return await this.roomService.create(dto, files);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() limit: string) {
    return await this.roomService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.roomService.findById(id);
  }

  @ApiQuery({
    name: 'urlId',
    required: false,
    type: String,
  })
  @ApiBearerAuth('Authorization')
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Put('admin/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() dto: RoomUpdateDto,
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.roomService.update(id, dto, urlId, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Delete('admin/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return await this.roomService.delete(id);
  }

  @Get('search')
  async search() {}
}
