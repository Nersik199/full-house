import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async getById(id: number) {
    const user = await this.userModel.findOne({ where: { id } });
    return user?.dataValues || null;
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    return user?.dataValues || null;
  }

  async create(dto: AuthDto) {
    const { email, password } = dto;

    const existingUser = await this.getByEmail(email);

    if (existingUser) {
      throw new NotFoundException('User already exists');
    }

    try {
      const result = await this.userModel.create({
        email,
        password: await argon2.hash(password),
      });

      if (!result) {
        throw new Error('Failed to create user');
      }

      return { message: `User successfully created` };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
