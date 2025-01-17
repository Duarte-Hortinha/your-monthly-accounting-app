import type { Transaction } from '../types/transaction';

export type SortField = 'date' | 'amount' | 'type';
export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function sortTransactions(
  transactions: Transaction[],
  { field, direction }: SortConfig
): Transaction[] {
  if (!direction) return transactions;

  return [...transactions].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'date':
        comparison = new Date(a.transaction_date || 0).getTime() -
                    new Date(b.transaction_date || 0).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'type':
        comparison = a.accounting_type.localeCompare(b.accounting_type);
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}