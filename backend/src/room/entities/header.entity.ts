import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_rooms',
  timestamps: true,
})
export class HeaderRoom extends BaseHeader {}
