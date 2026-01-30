import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    return await this.usersService.create(dto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    const verifyUserPassword = await argon2.verify(user.password, password);
    if (!verifyUserPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async createToken(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      bearerToken: this.jwtService.sign({
        email: user.email,
        id: user.id,
      }),
    };
  }
}
