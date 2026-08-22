import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

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
}
