import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Room } from '@/room/entities/room.entity';
import { Lodge } from '@/lodge/entities/lodge.entity';

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  guestName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  guestPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  guestEmail: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'room_number',
  })
  roomNumber: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  checkIn: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
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
  })
  expiresAt: Date;

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
}
