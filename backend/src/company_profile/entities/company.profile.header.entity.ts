import { Table } from 'sequelize-typescript';

import { BaseHeader } from '@/shared/UniversalTable/header.table';

@Table({
	tableName: 'header_company_profile',
	timestamps: true,
})
export class CompanyProfileHeader extends BaseHeader {}
