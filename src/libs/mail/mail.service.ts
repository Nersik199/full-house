import { type ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/components';
import { PaymentSuccessTemplate } from './templates';

interface paymentData {
  transactionId: string;
  amount: { value: string; currency: string };
  roomNumber: string;
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  public async sendPaymentSuccessEmail(email: string, payment: paymentData) {
    const html = await render(PaymentSuccessTemplate({ payment }));
    await this.sendMail({
      to: email,
      subject: 'Платёж успешно обработан',
      html,
    });
  }

  async sendMail(options: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(options);
    } catch (error) {
      this.logger.error(`Failed to send email:`, error);
      throw error;
    }
  }
}
