import { Op } from 'sequelize';

export interface TransactionWhereInput {
	status: string;
	createdAt?: {
		[Op.gte]?: Date | string;
		[Op.lte]?: Date | string;
	};
}
