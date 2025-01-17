import type { Transaction } from '../types/transaction';

export function searchTransactions(
  transactions: Transaction[],
  searchTerm: string
): Transaction[] {
  if (!searchTerm) return transactions;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return transactions.filter(transaction => {
    return (
      transaction.description.toLowerCase().includes(lowercaseSearch) ||
      transaction.category.toLowerCase().includes(lowercaseSearch) ||
      Math.abs(transaction.amount).toString().includes(lowercaseSearch)
    );
  });
}

export function sortTransactionsByAmount(
  transactions: Transaction[],
  direction: 'asc' | 'desc' | null
): Transaction[] {
  if (!direction) return transactions;
  
  return [...transactions].sort((a, b) => {
    const comparison = a.amount - b.amount;
    return direction === 'asc' ? comparison : -comparison;
  });
}