import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_dining_room',
  timestamps: true,
})
export class DiningRoomHeader extends BaseHeader {}
