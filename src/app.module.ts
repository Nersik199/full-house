import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeConfig } from './config/sequelize.config';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
