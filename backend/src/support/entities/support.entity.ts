import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
	tableName: 'supports',
	timestamps: true,
})
export class Support extends Model {
	@Column({
		type: DataType.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@Column({
		type: DataType.ENUM('terms', 'privacy'),
		allowNull: false,
	})
	type: 'terms' | 'privacy';

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	content: string;

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
