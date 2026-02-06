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
import { MenuService } from './menu.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import { MenuCreateDto, MenuUpdateDto } from './dto/menu.dto';
import { HeaderMenuCreateDto, HeaderMenuUpdateDto } from './dto/header.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create/header')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: HeaderMenuCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.menuService.createHeader(dto, file);
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
    @Body() dto: HeaderMenuUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.menuService.updateHeader(id, urlId, dto, file);
  }

  @Get('header/info')
  async getHeader() {
    return await this.menuService.getHeader();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @CurrentAdmin('id') userId: number,
    @Body() dto: MenuCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.menuService.create(dto, file);
  }

  @Get('all')
  async findAll() {
    return await this.menuService.findAll();
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Put('admin/update/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() dto: MenuUpdateDto,
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.menuService.update(id, dto, urlId, file);
  }

  @ApiBearerAuth('Authorization')
  @Auth()
  @Delete('admin/delete/:id')
  async delete(@Param('id') id: number) {
    return await this.menuService.delete(id);
  }
}
