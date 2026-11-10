import { Table } from 'sequelize-typescript';

import { BaseHeader } from '@/shared/UniversalTable/header.table';

@Table({
	tableName: 'header_Karaoke_us',
	timestamps: true,
})
export class KaraokeUsHeader extends BaseHeader {}
