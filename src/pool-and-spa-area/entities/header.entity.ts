import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_pool_spa',
  timestamps: true,
})
export class PoolAndSpaAreaHeader extends BaseHeader {}
