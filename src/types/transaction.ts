export type PaymentMethod = 'Santander/MB Way' | 'Monese' | 'Revolut' | 'Dinheiro';
export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export type DefaultCategory = 
  | 'Alimentação'
  | 'Transportes'
  | 'Habitação'
  | 'Utilidades'
  | 'Saúde'
  | 'Entretenimento'
  | 'Escritório'
  | 'Serviços'
  | 'Rendimentos'
  | 'Outro';

export interface Transaction {
  id: string;
  amount: number;
  currency: CurrencyCode;
  exchange_rate: number;
  eur_amount: number;
  type: 'expense' | 'revenue';
  payment_method: PaymentMethod;
  has_receipt: boolean;
  description: string;
  accounting_type: 'internal' | 'external';
  category: string;
  transaction_date: string | null;
  transaction_time: string | null;
  created_at: string;
}

export interface TransactionFormData extends Omit<Transaction, 'id' | 'created_at' | 'eur_amount'> {}