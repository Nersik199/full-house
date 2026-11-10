import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FilesModule } from '@/files/files.module';

import { KaraokeUs } from './entities/karaoke_us.entity';
import { KaraokeUsHeader } from './entities/karaoke_us.header.entity';
import { KaraokeUsController } from './karaoke_us.controller';
import { KaraokeUsService } from './karaoke_us.service';

@Module({
	imports: [
		SequelizeModule.forFeature([KaraokeUs, KaraokeUsHeader]),
		FilesModule,
	],
	controllers: [KaraokeUsController],
	providers: [KaraokeUsService],
})
export class KaraokeUsModule {}
