import {
  Body,
  Controller,
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
import { CompanyProfileService } from './company_profile.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentAdmin } from '@/user/decorators/user.decorator';
import {
  CompanyProfileCreateDto,
  CompanyProfileUpdateDto,
} from './dto/company_profile.dto';

@Controller('company-profile')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @ApiBearerAuth('Authorization')
  @Auth()
  @Post('admin/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async createHeader(
    @CurrentAdmin('role') role: string,
    @Body() dto: CompanyProfileCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.companyProfileService.create(dto, file);
  }

  @ApiQuery({
    name: 'urlId',
    required: false,
    type: String,
  })
  @ApiBearerAuth('Authorization')
  @Auth()
  @Put('admin/update/profile/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async updateHeader(
    @Param('id') id: number,
    @Query('urlId') urlId: string,
    @CurrentAdmin('id') userId: number,
    @Body() dto: CompanyProfileUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.companyProfileService.update(id, urlId, dto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHeader() {
    return await this.companyProfileService.get();
  }
}
