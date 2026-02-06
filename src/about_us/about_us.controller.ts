import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import { AboutUsCreateDto, AboutUsUpdateDto } from './dto/about_us.createDto';
import {
  HeaderAboutUsCreateDto,
  HeaderAboutUsUpdateDto,
} from './dto/header.dto';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create/header')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: HeaderAboutUsCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.aboutUsService.createHeader(dto, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Put('admin/update/header/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateHeader(
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @CurrentAdmin('id') userId: number,
    @Body() dto: HeaderAboutUsUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.aboutUsService.updateHeader(id, urlId, dto, file);
  }

  @Get('header/info')
  async getHeader() {
    return await this.aboutUsService.getHeader();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @ApiConsumes('multipart/form-data')
  async create(
    @CurrentAdmin('role') role: string,
    @Body() dto: AboutUsCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.aboutUsService.create(dto, file);
  }

  @Get('all')
  async findAll(@Query() limit: string) {
    return await this.aboutUsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.aboutUsService.findById(id);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Put('admin/update/:id')
  async update(
    @Body() dto: AboutUsUpdateDto,
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.aboutUsService.update(id, dto, urlId, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Delete('admin/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.aboutUsService.delete(id);
  }
}
