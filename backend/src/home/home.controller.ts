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
import { HomeService } from './home.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import { HeaderHomeCreateDto, HeaderHomeUpdateDto } from './dto/header.dto';
import { HomeCreateDto, HomeUpdateDto } from './dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create/header')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: HeaderHomeCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.homeService.createHeader(dto, file);
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
    @Body() dto: HeaderHomeUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.homeService.updateHeader(id, urlId, dto, file);
  }

  @Get('header/info')
  @HttpCode(HttpStatus.OK)
  async getHeader() {
    return await this.homeService.getHeader();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @CurrentAdmin('role') role: string,
    @Body() dto: HomeCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.homeService.create(dto, file);
  }

  @Get('all')
  async findAll(@Query() limit: string) {
    return await this.homeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.homeService.findById(id);
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
  async update(
    @Body() dto: HomeUpdateDto,
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.homeService.update(id, dto, urlId, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Delete('admin/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.homeService.delete(id);
  }
}
