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
import { RoomService } from '@/room/room.service';
import { LodgeService } from '@/lodge/lodge.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly FRONTEND_URL: string;
  private readonly ALLOWED_IPS: string[];

  constructor(
    private readonly yookassaService: YookassaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly roomService: RoomService,
    private readonly lodgeService: LodgeService,
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
        lodgeId: order.lodgeId ? order.lodgeId.toString() : null,
        roomId: order.roomId ? order.roomId.toString() : null,
        roomNumber: order.roomNumber.toString(),
        startDate: order.startDate.toISOString(),
        endDate: order.endDate.toISOString(),
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
      return { status: 'canceled' };
    }

    return { status: 'ok' };
  }

  private async processPayment(paymentObject: any) {
    const { orderId, lodgeId, roomId, roomNumber, startDate, endDate } =
      paymentObject.metadata;

    if (!orderId) {
      throw new BadRequestException('orderId not found in metadata');
    }

    this.logger.log(`Payment success for order ${orderId}`);

    if (roomId) {
      await this.roomService.updateRoom(
        roomId,
        new Date(startDate),
        new Date(endDate),
      );
    }

    if (lodgeId) {
      await this.lodgeService.updateLodge(
        lodgeId,
        new Date(startDate),
        new Date(endDate),
      );
    }

    await this.orderModel.update(
      {
        roomNumber,
        metaData: JSON.stringify(paymentObject.metadata),
        paymentMethodData: JSON.stringify(paymentObject.payment_method),
        status: paymentObject.status === 'succeeded' ? 'SUCCEEDED' : 'PENDING',
      },
      { where: { id: orderId } },
    );

    await this.sendMail(paymentObject);
    return { status: 'processed' };
  }

  private async sendMail(paymentObject: any) {
    const email = paymentObject.metadata?.email;
    if (!email) {
      throw new BadRequestException('email not found in metadata');
    }
    try {
      const email = paymentObject.metadata?.email;
      if (email) {
        await this.mailService.sendPaymentSuccessEmail(email, {
          transactionId: paymentObject.id,
          amount: paymentObject.amount,
          roomNumber: paymentObject.metadata.roomNumber,
          startDate: paymentObject.metadata.startDate,
          endDate: paymentObject.metadata.endDate,
        });
        this.logger.log(`Email sent to ${email}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email for order ${email}: ${error}`);
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
