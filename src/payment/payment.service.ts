import {
  Injectable,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConfirmationEnum,
  type CreatePaymentRequest,
  CurrencyEnum,
  PaymentMethodsEnum,
  VatCodesEnum,
  YookassaService,
} from 'nestjs-yookassa';
import CIDR from 'ip-cidr';

import { ConfigService } from '@nestjs/config';
import { MailService } from '@/libs/mail/mail.service';
import { PaymentMethod } from '@/shared/enums/payment-method.enum';
import { InitPaymentRequest } from './dto/payment.dto';
import { InjectModel } from '@nestjs/sequelize';

import { Order } from '@/order/entities/order.entity';
import { BookingService } from '@/booking/booking.service';
import { TicketService } from '@/ticket/ticket.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly FRONTEND_URL: string;
  private readonly ALLOWED_IPS: string[];

  constructor(
    private readonly yookassaService: YookassaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly bookingService: BookingService,
    private readonly ticketService: TicketService,
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {
    this.FRONTEND_URL = this.configService.getOrThrow<string>(
      'FRONTEND_REDIRECT_URL',
    )!;

    this.ALLOWED_IPS = [
      '185.71.76.0/27',
      '185.71.77.0/27',
      '77.75.153.0/25',
      '77.75.154.128/25',
      '77.75.156.11',
      '77.75.156.35',
      '2a02:5180::/32',
    ];
  }

  async createPayment(order: InitPaymentRequest, method: PaymentMethod) {
    if (!order.customerEmail) {
      throw new BadRequestException('Email is required');
    }

    let providerResponse;

    switch (method) {
      case PaymentMethod.BANK_CARD:
        providerResponse = await this.yookassaService.payments.create(
          this.prepareYookassaData(order, PaymentMethodsEnum.BANK_CARD),
        );
        break;
      case PaymentMethod.SBP:
        providerResponse = await this.yookassaService.payments.create(
          this.prepareYookassaData(order, PaymentMethodsEnum.SBP),
        );
        break;
      case PaymentMethod.YOOMONEY:
        providerResponse = await this.yookassaService.payments.create(
          this.prepareYookassaData(order, PaymentMethodsEnum.YOOMONEY),
        );
        break;
      case PaymentMethod.T_BANK:
        providerResponse = await this.yookassaService.payments.create(
          this.prepareYookassaData(order, PaymentMethodsEnum.T_BANK),
        );
        break;
      case PaymentMethod.SBERBANK:
        providerResponse = await this.yookassaService.payments.create(
          this.prepareYookassaData(order, PaymentMethodsEnum.SBERBANK),
        );
        break;
      default:
        throw new BadRequestException('Unsupported payment method');
    }

    return {
      paymentId: providerResponse.id || providerResponse.uuid,
      confirmationUrl:
        providerResponse.confirmation?.confirmation_url || providerResponse.url,
      rawResponse: providerResponse,
    };
  }

  private prepareYookassaData(
    order: InitPaymentRequest,
    yooMethod: PaymentMethodsEnum,
  ): CreatePaymentRequest {
    return {
      amount: {
        value: order.totalAmount,
        currency: CurrencyEnum.RUB,
      },
      description: `Оплата заказа №${order.id}`,
      payment_method_data: {
        // @ts-ignore
        type: yooMethod,
      },
      confirmation: {
        type: ConfirmationEnum.REDIRECT,
        return_url: `${this.FRONTEND_URL}/payment/success`,
      },
      capture: true,
      save_payment_method: false,
      // ...(yooMethod === 'sbp' && {
      //   capture: true,
      // }),
      metadata: {
        email: order.customerEmail,
        orderId: order.id.toString(),
        bookingIds: order.bookingIds ? order.bookingIds.join(',') : '',
        ticketQuantity: order.ticketQuantity?.toString() ?? '0',
      },
      receipt: {
        customer: { email: order.customerEmail },
        items: [
          {
            description: 'Бронирование проживания',
            quantity: 1,
            amount: {
              value: order.totalAmount,
              currency: CurrencyEnum.RUB,
            },
            vat_code: VatCodesEnum.NDS_NONE,
          },
        ],
      },
    };
  }

  async handleWebhook(payload: any, ip: string) {
    this.verifyIp(ip);

    this.logger.log(`Webhook event: ${payload.event}`);

    if (payload.event === 'payment.waiting_for_capture') {
      return await this.yookassaService.payments.capture(payload.object.id);
    }

    if (payload.event === 'payment.succeeded') {
      return await this.processPayment(payload.object);
    }

    if (payload.event === 'payment.canceled') {
      await this.bookingService.cancelBooking(
        payload.object.metadata.bookingId,
      );

      await this.orderModel.update(
        { status: 'CANCELLED' },
        { where: { id: payload.object.metadata } },
      );
      return { status: 'canceled' };
    }

    return { status: 'ok' };
  }

  private async processPayment(paymentObject: any) {
    const {
      orderId,
      roomNumber,
      bookingIds: bookingIdsStr,
      ticketQuantity,
    } = paymentObject.metadata;

    if (!orderId) {
      throw new BadRequestException('orderId not found in metadata');
    }

    this.logger.log(`Payment success for order ${orderId}`);

    const bookingIds = bookingIdsStr
      ? bookingIdsStr.split(',').map(Number)
      : [];

    await this.orderModel.update(
      {
        metaData: JSON.stringify(paymentObject.metadata),
        paymentMethodData: JSON.stringify(paymentObject.payment_method),
        status: 'SUCCEEDED',
      },
      { where: { id: orderId } },
    );

    if (bookingIds.length > 0) {
      for (const id of bookingIds) {
        const booking = await this.bookingService.findOne(id);

        if (booking) {
          await this.bookingService.confirmBooking(id);

          if (booking.ticketId) {
            await this.ticketService.updateQuantity(
              booking.ticketId,
              booking.ticketQuantity,
            );
          }
        }
      }
    }
    await this.sendMail(paymentObject);
    return { status: 'processed' };
  }

  private async sendMail(paymentObject: any) {
    const { bookingIds: bookingIdsRaw } = paymentObject.metadata;

    if (!bookingIdsRaw) return;

    const bookingIds =
      typeof bookingIdsRaw === 'string'
        ? bookingIdsRaw.split(',').map(Number)
        : [Number(bookingIdsRaw)];

    try {
      for (const bookingId of bookingIds) {
        const booking = await this.bookingService.findOne(bookingId);
        if (!booking.guestEmail) {
          throw new BadRequestException('email not found in metadata');
        }
        if (booking.guestEmail && booking) {
          await this.mailService.sendPaymentSuccessEmail(booking.guestEmail, {
            transactionId: paymentObject.id,
            amount: paymentObject.amount,
            roomNumber: booking.roomNumber,
            startDate: booking.checkIn,
            endDate: booking.checkOut,
          });
          this.logger.log(`Email sent to ${booking.guestEmail}`);
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to send email for payment ${paymentObject.id}: ${error}`,
      );
    }
  }

  private verifyIp(ip: string) {
    for (const range of this.ALLOWED_IPS) {
      if (range.includes('/')) {
        const cidr = new CIDR(range);
        if (cidr.contains(ip)) return true;
      } else if (range === ip) return true;
    }

    throw new UnauthorizedException('Invalid webhook IP');
  }
}

//TODO: metadata,
