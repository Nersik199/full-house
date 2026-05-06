import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FilesModule } from '@/files/files.module';
import { MailModule } from '@/libs/mail/mail.module';

import { HeaderHome } from './entities/header.entity';
import { Home } from './entities/home.entity';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
	imports: [
		SequelizeModule.forFeature([Home, HeaderHome]),
		FilesModule,
		MailModule,
	],
	controllers: [HomeController],
	providers: [HomeService],
})
export class HomeModule {}
