
export type PaymentMethod = 'mobile' | 'card' | 'bank';

export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface PaymentConfig {
  mobile?: {
    provider: string;
    accountNumber: string;
    accountName: string;
  };
  card?: {
    processor: string;
    merchantId: string;
    apiKey: string;
  };
  bank?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    routingNumber: string;
  };
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  preferredPaymentMethod: PaymentMethod;
  paymentConfig: PaymentConfig;
  commissionRate: number;
  createdAt: string;
}

export interface Order {
  id: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  paymentConfirmedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'merchant' | 'admin';
  merchantId?: string;
}
