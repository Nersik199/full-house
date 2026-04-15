import { Module } from '@nestjs/common';
import { CompanyProfileService } from './company_profile.service';
import { CompanyProfileController } from './company_profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyProfile } from './entities/company.profile.entity';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([CompanyProfile]), FilesModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
})
export class CompanyProfileModule {}
