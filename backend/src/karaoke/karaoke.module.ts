import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FilesModule } from '@/files/files.module';
import { HeaderKaraoke } from '@/karaoke/entities/header.entity';
import { Karaoke } from '@/karaoke/entities/karaoke.entity';

import { KaraokeController } from './karaoke.controller';
import { KaraokeService } from './karaoke.service';

@Module({
	imports: [SequelizeModule.forFeature([Karaoke, HeaderKaraoke]), FilesModule],
	controllers: [KaraokeController],
	providers: [KaraokeService],
})
export class KaraokeModule {}
