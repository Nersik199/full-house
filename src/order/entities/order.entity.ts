import { PaymentMethodsEnum } from 'nestjs-yookassa';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  roomId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  lodgeId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'customer_name',
  })
  customerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'room_number',
  })
  roomNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'customer_email',
  })
  customerEmail: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'customer_phone',
  })
  customerPhone: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_amount',
  })
  totalAmount: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'meta_data',
  })
  metaData: JSON;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'payment_method_data',
  })
  paymentMethodData: JSON;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  member: number;

  @Column({
    type: DataType.DATE,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.ENUM('PENDING', 'SUCCEEDED', 'CANCELLED'),
    defaultValue: 'PENDING',
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'payment_id',
  })
  paymentId: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethodsEnum)),
    allowNull: false,
  })
  paymentMethod: string;
}
