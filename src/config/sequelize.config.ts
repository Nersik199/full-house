import { ConfigService } from '@nestjs/config';
import type { SequelizeModuleOptions } from '@nestjs/sequelize';

export async function SequelizeConfig(
  configService: ConfigService,
): Promise<SequelizeModuleOptions> {
  return {
    dialect: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DB'),
    autoLoadModels: true,
    synchronize: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
}
