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
    unique: true,
    allowNull: false,
  })
  name: string;

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
    type: DataType.INTEGER,
    allowNull: false,
  })
  Bathroom: number;

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
