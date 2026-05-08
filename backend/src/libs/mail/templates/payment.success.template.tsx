import * as React from 'react';
import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Heading,
	Hr,
	Preview,
	Button,
} from '@react-email/components';

interface PaymentSuccessTemplateProps {
	payment: {
		transactionId: string;
		amount: { value: string; currency: string };
		roomNumber?: number;
		ticketQuantity?: number;
		ticketDate?: string[];
		startDate: Date;
		endDate: Date;
	};
}

export function PaymentSuccessTemplate({
																				 payment,
																			 }: PaymentSuccessTemplateProps) {
	const start = new Date(payment.startDate);
	const end = new Date(payment.endDate);
	const nights = Math.ceil(
		(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
	);

	return (
		<Html>
			<Head>
				<style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
			</Head>
			<Preview>{'Бронирование подтверждено - Full House, Ленинаван'}</Preview>

			<Body style={body}>
				<Container style={container}>
					{/* Top accent bar */}
					<Section style={topBar} />

					{/* Header */}
					<Section style={headerSection}>
						<table
							width="100%"
							cellPadding="0"
							cellSpacing="0"
							style={{ borderCollapse: 'collapse' as const }}
						>
							<tr>
								<td align="center">
									<div style={logoMark}>FH</div>
								</td>
							</tr>
							<tr>
								<td align="center" style={{ paddingTop: '16px' }}>
									<Text style={brandName}>FULL HOUSE</Text>
								</td>
							</tr>
							<tr>
								<td align="center" style={{ paddingTop: '4px' }}>
									<Text style={brandSubtitle}>
										{'Ленинаван \u00B7 Ростов-на-Дону'}
									</Text>
								</td>
							</tr>
						</table>
					</Section>

					{/* Success badge */}
					<Section style={successBadgeSection}>
						<table
							width="100%"
							cellPadding="0"
							cellSpacing="0"
							style={{ borderCollapse: 'collapse' as const }}
						>
							<tr>
								<td align="center">
									<div style={successCircle}>
										<span style={checkmark}>&#10003;</span>
									</div>
								</td>
							</tr>
							<tr>
								<td align="center" style={{ paddingTop: '20px' }}>
									<Heading style={headingStyle}>
										{'Бронирование подтверждено'}
									</Heading>
								</td>
							</tr>
							<tr>
								<td align="center" style={{ paddingTop: '8px' }}>
									<Text style={subtitleText}>
										{
											'Спасибо за ваш заказ! Ниже представлены детали вашего бронирования.'
										}
									</Text>
								</td>
							</tr>
						</table>
					</Section>

					<Hr style={divider} />

					{/* Booking details card */}
					<Section style={detailsCard}>
						<Text style={sectionLabel}>{'Детали бронирования'}</Text>

						<table
							width="100%"
							cellPadding="0"
							cellSpacing="0"
							style={{
								borderCollapse: 'collapse' as const,
								marginTop: '16px',
							}}
						>
							<tr>
								<td style={detailRow}>
									<Text style={detailLabel}>{'Номер транзакции'}</Text>
									<Text style={detailValue}>{payment.transactionId}</Text>
								</td>
							</tr>
							<tr>
								<td>
									<div style={rowDivider} />
								</td>
							</tr>
							<tr>
								<td style={detailRow}>
									<Text style={detailLabel}>
										{payment.roomNumber ? 'Номер комнаты' : 'Количество билетов'}
									</Text>
									<Text style={detailValue}>
										{payment.roomNumber
											? `Комната №${payment.roomNumber}`
											: `${payment.ticketQuantity} шт.`}
									</Text>
								</td>
							</tr>
							<tr>
								<td>
									<div style={rowDivider} />
								</td>
							</tr>
							<tr>
								<td style={detailRow}>
									<Text style={detailLabel}>
										{payment.roomNumber ? 'Период проживания' : 'Дата посещения'}
									</Text>
									<Text style={detailValue}>
										{payment.roomNumber ? (
											`${start.toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'long',
											})} — ${end.toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'long',
											})}`
										) : (
											payment.ticketDate && payment.ticketDate.length > 0
												? payment.ticketDate.map((date, idx) => (
													<span key={idx}>
                            {new Date(date).toLocaleDateString('ru-RU', {
															day: 'numeric',
															month: 'long',
														})}
														{idx < payment.ticketDate.length - 1 ? ', ' : ''}
                          </span>
												))
												: 'Дата не указана'
										)}
									</Text>

									{payment.roomNumber && (
										<Text style={detailMeta}>{nights + ' ночей'}</Text>
									)}
								</td>
							</tr>
							<tr>
								<td>
									<div style={rowDivider} />
								</td>
							</tr>
							<tr>
								<td style={detailRow}>
									<Text style={detailLabel}>{'Сумма'}</Text>
									<Text style={amountValue}>
										{payment.amount.value + ' ' + payment.amount.currency}
									</Text>
								</td>
							</tr>
						</table>
					</Section>

					{/* Блок заезда/выезда отображается ТОЛЬКО для номеров */}
					{payment.roomNumber && (
						<Section style={scheduleCard}>
							<table
								width="100%"
								cellPadding="0"
								cellSpacing="0"
								style={{ borderCollapse: 'collapse' as const }}
							>
								<tr>
									<td width="50%" style={scheduleBox} valign="top">
										<Text style={scheduleIcon}>&#x2192;</Text>
										<Text style={scheduleLabel}>{'ЗАЕЗД'}</Text>
										<Text style={scheduleDate}>
											{start.toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'short',
											})}
										</Text>
										<Text style={scheduleTime}>{'с 14:00'}</Text>
									</td>
									<td
										width="50%"
										style={{
											...scheduleBox,
											borderLeft: '1px solid #e8e0d8',
										}}
										valign="top"
									>
										<Text style={scheduleIcon}>&#x2190;</Text>
										<Text style={scheduleLabel}>{'ВЫЕЗД'}</Text>
										<Text style={scheduleDate}>
											{end.toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'short',
											})}
										</Text>
										<Text style={scheduleTime}>{'до 12:00'}</Text>
									</td>
								</tr>
							</table>
						</Section>
					)}

					{/* Location */}
					<Section style={locationCard}>
						<table
							width="100%"
							cellPadding="0"
							cellSpacing="0"
							style={{ borderCollapse: 'collapse' as const }}
						>
							<tr>
								<td width="40" valign="top">
									<div style={locationPin}>
										<span style={{ fontSize: '16px' }}>&#x25CB;</span>
									</div>
								</td>
								<td valign="top" style={{ paddingLeft: '12px' }}>
									<Text style={locationLabel}>{'АДРЕС'}</Text>
									<Text style={locationText}>
										{'Россия, Ростов-на-Дону, хутор Ленинаван, Ул. Садовая 43'}
									</Text>
								</td>
							</tr>
						</table>
					</Section>

					<Hr style={divider} />

					{/* Contact buttons */}
					<Section style={contactSection}>
						<Text style={contactTitle}>{'Свяжитесь с нами'}</Text>
						<Text style={contactSubtitle}>
							{'Мы всегда готовы помочь с вашим бронированием'}
						</Text>

						<table
							width="100%"
							cellPadding="0"
							cellSpacing="0"
							style={{ borderCollapse: 'collapse' as const, marginTop: '20px' }}
						>
							<tr>
								<td align="center" style={{ paddingBottom: '12px' }}>
									<Button href="tel:+79614082888" style={primaryButton}>
										{'Позвонить +7 (961) 408-28-88'}
									</Button>
								</td>
							</tr>
							<tr>
								<td align="center">
									<Button
										href="mailto:fullhouseleninavan@gmail.com"
										style={secondaryButton}
									>
										{'Написать на Email'}
									</Button>
								</td>
							</tr>
						</table>
					</Section>

					{/* Footer */}
					<Section style={footer}>
						<Hr style={{ borderColor: '#e8e0d8', margin: '0 0 24px 0' }} />
						<Text style={footerBrand}>FULL HOUSE</Text>
						<Text style={footerAddress}>
							{'хутор Ленинаван, Ул. Садовая 43'}
						</Text>
						<Text style={footerNote}>
							{
								'Это письмо сформировано автоматически. Пожалуйста, не отвечайте на него.'
							}
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

const body: React.CSSProperties = {
	backgroundColor: '#f5f0eb',
	padding: '40px 16px',
	fontFamily:
		"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
	margin: 0,
};

const container: React.CSSProperties = {
	backgroundColor: '#ffffff',
	maxWidth: '560px',
	margin: '0 auto',
	borderRadius: '16px',
	overflow: 'hidden',
	boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 30px rgba(0,0,0,0.06)',
};

const topBar: React.CSSProperties = {
	height: '4px',
	background: 'linear-gradient(90deg, #8b6f47, #c9a96e, #8b6f47)',
};

const headerSection: React.CSSProperties = {
	padding: '36px 40px 0',
	textAlign: 'center' as const,
};

const logoMark: React.CSSProperties = {
	width: '56px',
	height: '56px',
	borderRadius: '50%',
	backgroundColor: '#3a2e22',
	color: '#c9a96e',
	fontSize: '20px',
	fontWeight: 700,
	lineHeight: '56px',
	textAlign: 'center' as const,
	margin: '0 auto',
	letterSpacing: '1px',
};

const brandName: React.CSSProperties = {
	fontSize: '18px',
	fontWeight: 700,
	color: '#3a2e22',
	letterSpacing: '4px',
	margin: 0,
};

const brandSubtitle: React.CSSProperties = {
	fontSize: '12px',
	color: '#8b7d6e',
	letterSpacing: '2px',
	margin: 0,
	textTransform: 'uppercase' as const,
};

const successBadgeSection: React.CSSProperties = {
	padding: '32px 40px 24px',
	textAlign: 'center' as const,
};

const successCircle: React.CSSProperties = {
	width: '64px',
	height: '64px',
	borderRadius: '50%',
	backgroundColor: '#e8f5e8',
	display: 'inline-block',
	lineHeight: '64px',
	textAlign: 'center' as const,
};

const checkmark: React.CSSProperties = {
	color: '#2d8a2d',
	fontSize: '28px',
	fontWeight: 700,
};

const headingStyle: React.CSSProperties = {
	fontSize: '24px',
	fontWeight: 700,
	color: '#3a2e22',
	margin: 0,
	lineHeight: '1.3',
};

const subtitleText: React.CSSProperties = {
	fontSize: '15px',
	color: '#8b7d6e',
	margin: 0,
	lineHeight: '1.5',
	maxWidth: '380px',
};

const divider: React.CSSProperties = {
	borderColor: '#e8e0d8',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderTop: 'none',
	margin: '0 40px',
};

const detailsCard: React.CSSProperties = {
	padding: '28px 40px',
};

const sectionLabel: React.CSSProperties = {
	fontSize: '11px',
	fontWeight: 600,
	color: '#8b7d6e',
	letterSpacing: '2px',
	margin: 0,
	textTransform: 'uppercase' as const,
};

const detailRow: React.CSSProperties = {
	padding: '14px 0',
};

const detailLabel: React.CSSProperties = {
	fontSize: '12px',
	color: '#a09486',
	margin: '0 0 4px 0',
	textTransform: 'uppercase' as const,
	letterSpacing: '0.5px',
};

const detailValue: React.CSSProperties = {
	fontSize: '16px',
	color: '#3a2e22',
	fontWeight: 600,
	margin: 0,
};

const detailMeta: React.CSSProperties = {
	fontSize: '13px',
	color: '#8b7d6e',
	margin: '4px 0 0 0',
};

const amountValue: React.CSSProperties = {
	fontSize: '22px',
	color: '#3a2e22',
	fontWeight: 700,
	margin: 0,
};

const rowDivider: React.CSSProperties = {
	height: '1px',
	backgroundColor: '#f0ebe5',
};

const scheduleCard: React.CSSProperties = {
	margin: '0 40px 24px',
	borderRadius: '12px',
	border: '1px solid #e8e0d8',
	overflow: 'hidden',
};

const scheduleBox: React.CSSProperties = {
	padding: '20px 24px',
	textAlign: 'center' as const,
	backgroundColor: '#faf8f5',
};

const scheduleIcon: React.CSSProperties = {
	fontSize: '18px',
	color: '#c9a96e',
	margin: '0 0 4px 0',
};

const scheduleLabel: React.CSSProperties = {
	fontSize: '10px',
	fontWeight: 600,
	color: '#8b7d6e',
	letterSpacing: '2px',
	margin: '0 0 6px 0',
};

const scheduleDate: React.CSSProperties = {
	fontSize: '18px',
	fontWeight: 700,
	color: '#3a2e22',
	margin: '0 0 2px 0',
};

const scheduleTime: React.CSSProperties = {
	fontSize: '14px',
	color: '#8b7d6e',
	margin: 0,
};

const locationCard: React.CSSProperties = {
	margin: '0 40px 28px',
	padding: '18px 20px',
	backgroundColor: '#faf8f5',
	borderRadius: '12px',
	border: '1px solid #e8e0d8',
};

const locationPin: React.CSSProperties = {
	width: '36px',
	height: '36px',
	borderRadius: '50%',
	backgroundColor: '#3a2e22',
	color: '#c9a96e',
	textAlign: 'center' as const,
	lineHeight: '36px',
};

const locationLabel: React.CSSProperties = {
	fontSize: '10px',
	fontWeight: 600,
	color: '#8b7d6e',
	letterSpacing: '2px',
	margin: '0 0 4px 0',
};

const locationText: React.CSSProperties = {
	fontSize: '14px',
	color: '#3a2e22',
	margin: 0,
	lineHeight: '1.5',
};

const contactSection: React.CSSProperties = {
	padding: '28px 40px',
	textAlign: 'center' as const,
};

const contactTitle: React.CSSProperties = {
	fontSize: '18px',
	fontWeight: 700,
	color: '#3a2e22',
	margin: '0 0 6px 0',
};

const contactSubtitle: React.CSSProperties = {
	fontSize: '14px',
	color: '#8b7d6e',
	margin: 0,
};

const primaryButton: React.CSSProperties = {
	backgroundColor: '#3a2e22',
	color: '#ffffff',
	padding: '14px 32px',
	borderRadius: '10px',
	fontSize: '14px',
	fontWeight: 600,
	textDecoration: 'none',
	display: 'inline-block',
	width: '100%',
	maxWidth: '320px',
	textAlign: 'center' as const,
	boxSizing: 'border-box' as const,
};

const secondaryButton: React.CSSProperties = {
	backgroundColor: 'transparent',
	color: '#3a2e22',
	padding: '14px 32px',
	borderRadius: '10px',
	fontSize: '14px',
	fontWeight: 600,
	textDecoration: 'none',
	display: 'inline-block',
	border: '1.5px solid #d4ccc2',
	width: '100%',
	maxWidth: '320px',
	textAlign: 'center' as const,
	boxSizing: 'border-box' as const,
};

const footer: React.CSSProperties = {
	padding: '0 40px 32px',
	textAlign: 'center' as const,
};

const footerBrand: React.CSSProperties = {
	fontSize: '13px',
	fontWeight: 700,
	color: '#3a2e22',
	letterSpacing: '3px',
	margin: '0 0 4px 0',
};

const footerAddress: React.CSSProperties = {
	fontSize: '12px',
	color: '#a09486',
	margin: '0 0 16px 0',
};

const footerNote: React.CSSProperties = {
	fontSize: '11px',
	color: '#b8ada2',
	margin: 0,
	lineHeight: '1.5',
};