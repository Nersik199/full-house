import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AboutUsService } from './about_us.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import { AboutUsCreateDto, AboutUsUpdateDto } from './dto/about_us.createDto';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}
  @ApiBearerAuth('bearer-Token')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @Post('admin/create')
  async create(
    @CurrentAdmin('role') role: string,
    @Body() dto: AboutUsCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {}

  @ApiBearerAuth('bearer-Token')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @Put('admin/update')
  async update(
    @CurrentAdmin('role') role: string,
    @Body() dto: AboutUsUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {}

  @Get('get')
  async getOne() {}
}
