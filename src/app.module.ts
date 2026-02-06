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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
