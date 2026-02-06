import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_about_us',
  timestamps: true,
})
export class AboutUsHeader extends BaseHeader {}
