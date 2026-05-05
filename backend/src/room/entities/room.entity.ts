import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
	tableName: 'rooms',
	timestamps: true,
})
export class Room extends Model {
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
		type: DataType.STRING,
		allowNull: true,
		field: 'sub_title',
	})
	subTitle: string;

	@Column({
		type: DataType.ENUM(
			'Standard',
			'Comfort',
			'Luxury',
			'Family',
			'Presidential',
		),
		allowNull: false,
		defaultValue: 'Standard',
		field: 'category',
	})
	category: 'Standard' | 'Comfort' | 'Luxury' | 'Family' | 'Presidential';
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	price: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	hourlyPrice?: number;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: true,
	})
	wifi: boolean;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 1,
	})
	member: number;

	@Column({
		type: DataType.JSON,
		allowNull: false,
	})
	images: JSON;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: 'room_number',
		unique: true,
	})
	roomNumber: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: 'bath_room',
	})
	bathroom: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 1,
	})
	tv: number;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	refrigerator: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
		field: 'ari_conditioner',
	})
	airConditioner: boolean;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 1,
		field: 'bed_count',
	})
	bedCount: number;

	@Column({
		type: DataType.ENUM('single', 'double'),
		allowNull: false,
		field: 'bed_type',
	})
	bedType: 'single' | 'double';

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
		field: 'living_room',
	})
	livingRoom: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
		field: 'dining_room',
	})
	diningRoom: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	balcony?: boolean;

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
