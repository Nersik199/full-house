import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { Booking } from '@/booking/entities/booking.entity';

@Table({
	tableName: 'lodges',
	timestamps: true,
})
export class Lodge extends Model {
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
		type: DataType.STRING,
		allowNull: true,
	})
	subTitle: string;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	description: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	price: number;

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

	// @Column({
	// 	type: DataType.INTEGER,
	// 	allowNull: false,
	// 	field: 'room_number',
	// 	unique: true,
	// })
	// roomNumber: number;

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
		allowNull: false,
		defaultValue: false,
	})
	smoking: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	refrigerator: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	airConditioner: boolean;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	bedCount: number;

	@Column({
		type: DataType.ENUM('single', 'double'),
		allowNull: true,
	})
	bedType: 'single' | 'double';

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	livingRoom: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: false,
	})
	diningRoom: boolean;

	@HasMany(() => Booking, { foreignKey: 'lodgeId', as: 'bookings' })
	bookings: Booking[];

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
