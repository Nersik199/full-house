import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeConfig } from './config/sequelize.config';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { FilesModule } from './files/files.module';
import { MenuModule } from './menu/menu.module';
import { AboutUsModule } from './about_us/about_us.module';
import { DiningRoomModule } from './dining_room/dining_room.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { LibsModule } from './libs/libs.module';
import { LodgeModule } from './lodge/lodge.module';
import { PoolAndSpaAreaModule } from './pool-and-spa-area/pool-and-spa-area.module';
import { BookingModule } from './booking/booking.module';
import { HomeModule } from './home/home.module';
import { CompanyProfileModule } from './company_profile/company_profile.module';
import { StatisticsModule } from './statistics/statistics.module';
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
  ],
  providers: [],
})
export class AppModule {}
