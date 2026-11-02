import { Table } from 'sequelize-typescript';

import { BaseHeader } from '@/shared/UniversalTable/header.table';

@Table({
	tableName: 'header_karaoke',
	timestamps: true,
})
export class HeaderKaraoke extends BaseHeader {}
