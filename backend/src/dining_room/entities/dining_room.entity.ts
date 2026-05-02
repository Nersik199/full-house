import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
	tableName: 'dining_room',
	timestamps: true,
})
export class DiningRoom extends Model {
	@Column({
		type: DataType.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	title: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	description: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	image: string;

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
