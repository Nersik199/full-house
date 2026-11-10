import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AboutUsModule } from './about_us/about_us.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CartModule } from './cart/cart.module';
import { CompanyProfileModule } from './company_profile/company_profile.module';
import { SequelizeConfig } from './config/sequelize.config';
import { DiningRoomModule } from './dining_room/dining_room.module';
import { FilesModule } from './files/files.module';
import { HomeModule } from './home/home.module';
import { KaraokeUsModule } from './karaoke_us/karaoke_us.module';
import { LibsModule } from './libs/libs.module';
import { LodgeModule } from './lodge/lodge.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PoolAndSpaAreaModule } from './pool-and-spa-area/pool-and-spa-area.module';
import { RoomModule } from './room/room.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SupportModule } from './support/support.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: SequelizeConfig,
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
		RoomModule,
		FilesModule,
		MenuModule,
		AboutUsModule,
		DiningRoomModule,
		OrderModule,
		LibsModule,
		LodgeModule,
		PoolAndSpaAreaModule,
		PaymentModule,
		BookingModule,
		HomeModule,
		CompanyProfileModule,
		StatisticsModule,
		TicketModule,
		CartModule,
		SupportModule,
		KaraokeUsModule,
	],
	providers: [],
})
export class AppModule {}
