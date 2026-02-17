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
    roomNumber: string;
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
  console.log(payment);
  return (
    <Html>
      <Head />
      <Preview>Подтверждение аренды номера</Preview>

      <Body style={{ backgroundColor: '#f0f2f5', padding: '20px' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <Heading style={{ color: '#333', marginBottom: '20px' }}>
            🏨 Подтверждение бронирования
          </Heading>

          <Text>Спасибо за ваш заказ! Ниже детали аренды вашего номера:</Text>

          <Hr />

          <Section style={{ marginBottom: '20px' }}>
            <Text>
              <strong>Номер транзакции:</strong> {payment.transactionId}
            </Text>
            <Text>
              <strong>Номер:</strong> {payment.roomNumber}
            </Text>
            <Text>
              <strong>Период проживания:</strong> {start.toLocaleDateString()} —{' '}
              {end.toLocaleDateString()} ({nights} ночей)
            </Text>
            <Text>
              <strong>Сумма:</strong> {payment.amount.value}{' '}
              {payment.amount.currency}
            </Text>
          </Section>

          <Hr />

          <Section style={{ textAlign: 'center', margin: '20px 0' }}>
            <Button
              pY={12}
              pX={20}
              style={{
                backgroundColor: '#007BFF',
                color: '#ffffff',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
              href={`x/my-bookings`}
            >
              Посмотреть бронирование
            </Button>
          </Section>

          <Text style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
            Это письмо сгенерировано автоматически. Пожалуйста, не отвечайте на
            него.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
