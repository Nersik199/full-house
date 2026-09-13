import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
	tableName: 'company_profile',
})
export class CompanyProfile extends Model {
	@Column({
		type: DataType.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;
	@Column({
		type: DataType.STRING,
		allowNull: true,
		field: 'name_company',
	})
	nameCompany?: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	mail: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	tel: string;

	@Column({
		type: DataType.TEXT,
		allowNull: true,
	})
	image?: string;
}
