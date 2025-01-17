import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../types/transaction';
import type { User } from '@supabase/supabase-js';

export function useTransactions(user: User | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
      } else {
        fetchTransactions();
      }
    }
  }, [user, fetchTransactions]);

  return {
    transactions,
    loading,
    fetchTransactions,
    deleteTransaction
  };
}