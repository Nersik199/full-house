import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'lodge_rooms',
  timestamps: true,
})
export class HeaderLodge extends BaseHeader {}
