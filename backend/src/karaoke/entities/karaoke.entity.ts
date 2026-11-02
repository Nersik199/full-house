import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
	tableName: 'karaoke',
	timestamps: true,
})
export class Karaoke extends Model {
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
	description: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	youtubeUrl: string;

	@Column({
		type: DataType.JSON,
		allowNull: false,
	})
	images: JSON;

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
