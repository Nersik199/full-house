import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Support } from '@/support/entities/support.entity';

import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
	imports: [SequelizeModule.forFeature([Support])],
	controllers: [SupportController],
	providers: [SupportService],
})
export class SupportModule {}
