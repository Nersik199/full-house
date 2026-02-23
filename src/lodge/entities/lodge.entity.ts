import { Column, DataType, Model, Table } from 'sequelize-typescript';
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
    allowNull: false,
    defaultValue: false,
  })
  smoking: boolean;

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
