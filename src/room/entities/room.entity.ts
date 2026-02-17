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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  Busy: boolean;

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
    type: DataType.DATE,
    allowNull: true,
    field: 'rental_start',
  })
  rentalStart: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'rental_end',
  })
  rentalEnd: Date;

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

const roomFieldsTranslation = {
  id: 'Идентификатор комнаты (ID)',
  title: 'Название комнаты',
  description: 'Описание комнаты',
  price: 'Цена',
  wifi: 'Наличие Wi-Fi (да / нет)',
  member: 'Количество человек (вместимость)',
  images: 'Изображения комнаты',
  roomNumber: 'Номер комнаты',
  bathroom: 'Количество ванных комнат',
  tv: 'Количество телевизоров',
  smoking: 'Разрешено ли курение (да / нет)',
  Busy: 'Занята ли комната (да / нет)',
  refrigerator: 'Наличие холодильника (да / нет)',
  airConditioner: 'Наличие кондиционера (да / нет)',
  bedCount: 'Количество кроватей',
  bedType: 'Тип кровати (односпальная / двуспальная)',
  livingRoom: 'Наличие гостиной (да / нет)',
  diningRoom: 'Наличие столовой (да / нет)',
  rentalStart: 'Дата начала аренды',
  rentalEnd: 'Дата окончания аренды',
  createdAt: 'Дата создания записи',
  updatedAt: 'Дата обновления записи',
};
