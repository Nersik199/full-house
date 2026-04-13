import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from 'sequelize-typescript';

import { Lodge } from '@/lodge/entities/lodge.entity';
import { Room } from '@/room/entities/room.entity';
import { Ticket } from '@/ticket/entities/ticket.entity';

@Table({
	tableName: 'bookings',
	timestamps: true,
})
export class Booking extends Model {
	@Column({
		type: DataType.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;

	@ForeignKey(() => Room)
	@Column({
		type: DataType.BIGINT,
		allowNull: true,
		field: 'room_id',
	})
	roomId: number;

	@BelongsTo(() => Room)
	room: Room;

	@ForeignKey(() => Lodge)
	@Column({
		type: DataType.BIGINT,
		allowNull: true,
		field: 'lodge_id',
	})
	lodgeId: number;

	@BelongsTo(() => Lodge)
	lodge: Lodge;

	@ForeignKey(() => Ticket)
	@Column({
		type: DataType.BIGINT,
		allowNull: true,
		field: 'ticket_id',
	})
	ticketId: number;

	@BelongsTo(() => Ticket)
	ticket: Ticket;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
		field: 'ticket_quantity',
	})
	ticketQuantity?: number;

	@Column({
		type: DataType.BIGINT,
		allowNull: true,
		field: 'order_id',
	})
	orderId?: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'guest_name',
	})
	guestName: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'guest_email',
	})
	guestPhone: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		field: 'guest_phone',
	})
	guestEmail: string;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
		field: 'room_number',
	})
	roomNumber: number;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
		field: 'check_in',
	})
	checkIn: Date;

	@Column({
		type: DataType.DATEONLY,
		allowNull: false,
		field: 'check_out',
	})
	checkOut: Date;

	@Column({
		type: DataType.ENUM('online', 'walk-in'),
		allowNull: false,
	})
	source: 'online' | 'walk-in';

	@Column({
		type: DataType.DATE,
		allowNull: true,
		field: 'expires_at',
	})
	expiresAt: Date;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
	})
	member?: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
		field: 'total_price',
	})
	totalPrice: number;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	category?: string;

	@Column({
		type: DataType.ENUM(
			'pending',
			'confirmed',
			'checked_in',
			'checked_out',
			'cancelled',
		),
		defaultValue: 'pending',
	})
	status: string;

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
