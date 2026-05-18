import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import { CartService } from './cart.service';
import {GetCartTicketsDto} from "@/cart/dto/get-cart-tickets.dto";

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('tickets')
  @HttpCode(HttpStatus.OK)
  async getCartTickets(@Body() dto: GetCartTicketsDto) {
    return await this.cartService.getCartTickets(dto.ids);
  }
}
