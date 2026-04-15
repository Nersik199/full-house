import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'slider_images',
  timestamps: false,
})
export class SliderImage extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  images: JSON;
}
