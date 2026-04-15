import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_menus',
  timestamps: true,
})
export class HeaderMenu extends BaseHeader {}
