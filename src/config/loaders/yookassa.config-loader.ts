import { ConfigService } from '@nestjs/config';
import type { YookassaModuleOptions } from 'nestjs-yookassa';

import { YookassaConfig } from '../definitions/yookassa.config';

export function getYookassaConfig(
  configService: ConfigService<YookassaConfig>,
): YookassaModuleOptions {
  return {
    shopId: configService.getOrThrow<string>('YOOKASSA_SHOP_ID', {
      infer: true,
    }),
    apiKey: configService.getOrThrow<string>('YOOKASSA_SECRET_KEY', {
      infer: true,
    }),
  };
}
