import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { YookassaWebhook } from 'nestjs-yookassa';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  @YookassaWebhook()
  async handleWebhook(@Body() body: any, @Ip() ip: string) {
    console.log('Received webhook from IP:', ip);
    return this.paymentService.handleWebhook(body, ip);
  }
}
