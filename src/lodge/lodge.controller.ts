import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { LodgeService } from './lodge.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import { HeaderLodgeCreateDto, HeaderLodgeUpdateDto } from './dto/header.dto';
import { LodgeCreateDto, LodgeUpdateDto } from './dto/lodge.dto';

@Controller('lodge')
export class LodgeController {
  constructor(private readonly lodgeService: LodgeService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create/header')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: HeaderLodgeCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.lodgeService.createHeader(dto, file);
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
    @Body() dto: HeaderLodgeUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.lodgeService.updateHeader(id, urlId, dto, file);
  }

  @Get('header/info')
  @HttpCode(HttpStatus.OK)
  async getHeader() {
    return await this.lodgeService.getHeader();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.OK)
  async create(
    @CurrentAdmin('role') role: string,
    @Body() dto: LodgeCreateDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return await this.lodgeService.create(dto, files);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() limit: string) {
    return await this.lodgeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.lodgeService.findById(id);
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
    @Body() dto: LodgeUpdateDto,
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.lodgeService.update(id, dto, urlId, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Delete('admin/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return await this.lodgeService.delete(id);
  }
}
