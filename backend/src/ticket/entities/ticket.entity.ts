import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
	tableName: 'tickets',
	timestamps: true,
})
export class Ticket extends Model {
	@Column({
		type: DataType.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	date: Date;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	quantity: number;

	@Column({
		type: DataType.DECIMAL(10, 2),
		allowNull: false,
		get() {
			const value = this.getDataValue('price');
			return value === null ? null : parseFloat(value);
		},
	})
	price: number;

	@Column({
		type: DataType.DECIMAL(10, 2),
		allowNull: false,
		field: 'final_price',
		get() {
			const value = this.getDataValue('finalPrice');
			return value === null ? null : parseFloat(value);
		},
	})
	finalPrice: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	discount?: number;

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		field: 'created_at',
	})
	createdAt: Date;

	@Column({
		type: DataType.DATE,
		defaultValue: DataType.NOW,
		field: 'updated_at',
	})
	updatedAt: Date;
}
