import { BaseHeader } from '@/shared/UniversalTable/header.table';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'header_ticket',
  timestamps: true,
})
export class TicketHeader extends BaseHeader {}
