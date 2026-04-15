import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_home',
  timestamps: true,
})
export class HeaderHome extends BaseHeader {}
