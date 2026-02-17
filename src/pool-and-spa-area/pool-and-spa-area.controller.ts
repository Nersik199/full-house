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
  UseInterceptors,
} from '@nestjs/common';
import { PoolAndSpaAreaService } from './pool-and-spa-area.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import {
  HeaderPoolSpaCreateDto,
  HeaderPoolSpaUpdateDto,
} from './dto/header.dto';
import { PoolSpaCreateDto, PoolSpaUpdateDto } from './dto/pool_spa.createDto';

@Controller('pool-spa')
export class PoolAndSpaAreaController {
  constructor(private readonly poolAndSpaAreaService: PoolAndSpaAreaService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create/header')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: HeaderPoolSpaCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.poolAndSpaAreaService.createHeader(dto, file);
  }

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
    @Body() dto: HeaderPoolSpaUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.poolAndSpaAreaService.updateHeader(id, urlId, dto, file);
  }

  @Get('header/info')
  @HttpCode(HttpStatus.OK)
  async getHeader() {
    return await this.poolAndSpaAreaService.getHeader();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @CurrentAdmin('role') role: string,
    @Body() dto: PoolSpaCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.poolAndSpaAreaService.create(dto, file);
  }

  @Get('all')
  async findAll(@Query() limit: string) {
    return await this.poolAndSpaAreaService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.poolAndSpaAreaService.findById(id);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Put('admin/update/:id')
  async update(
    @Body() dto: PoolSpaUpdateDto,
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.poolAndSpaAreaService.update(id, dto, urlId, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Delete('admin/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.poolAndSpaAreaService.delete(id);
  }
}
