import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CategorySelector } from './CategorySelector';
import { CurrencySelector } from './CurrencySelector';
import { DateTimeFields } from './DateTimeFields';
import { MonthSelector } from './MonthSelector';
import { DescriptionAutosuggest } from './DescriptionAutosuggest';
import { getFirstDayOfMonth } from '../utils/date';
import type { Transaction, TransactionFormData } from '../types/transaction';
import type { MonthSelection } from '../types/date';

interface TransactionFormProps {
  onTransactionAdded: () => void;
  initialData?: Transaction | null;
  onCancel?: () => void;
  selectedMonth: MonthSelection;
  onMonthChange: (month: MonthSelection) => void;
}

export function TransactionForm({ 
  onTransactionAdded, 
  initialData, 
  onCancel,
  selectedMonth,
  onMonthChange
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>(() => {
    if (!initialData) {
      return {
        amount: 0,
        currency: 'EUR',
        exchange_rate: 1,
        type: 'expense',
        payment_method: 'Dinheiro',
        has_receipt: false,
        description: '',
        accounting_type: 'internal',
        category: 'Outro',
        transaction_date: null,
        transaction_time: null
      };
    }

    return {
      amount: Math.abs(initialData.amount),
      currency: initialData.currency,
      exchange_rate: initialData.exchange_rate,
      type: initialData.type,
      payment_method: initialData.payment_method,
      has_receipt: initialData.has_receipt,
      description: initialData.description,
      accounting_type: initialData.accounting_type,
      category: initialData.category,
      transaction_date: initialData.transaction_date,
      transaction_time: initialData.transaction_time
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('payment_methods')
      .select('name')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      console.error('Error loading payment methods:', error);
      return;
    }

    setPaymentMethods(data.map(pm => pm.name));
  }

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      amount: isNaN(amount) ? 0 : amount
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilizador não autenticado');

      const finalAmount = formData.type === 'expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
      const finalDate = formData.transaction_date || getFirstDayOfMonth(selectedMonth);

      const transactionData = {
        ...formData,
        transaction_date: finalDate,
        amount: finalAmount,
        user_id: user.id,
      };

      let query;
      if (initialData?.id) {
        query = supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', initialData.id)
          .select();
      } else {
        query = supabase
          .from('transactions')
          .insert(transactionData)
          .select();
      }

      const { error: dbError, data } = await query;

      if (dbError) throw dbError;
      if (!data || data.length === 0) throw new Error('Erro ao guardar transação');

      setFormData({
        amount: 0,
        currency: 'EUR',
        exchange_rate: 1,
        type: 'expense',
        payment_method: 'Dinheiro',
        has_receipt: false,
        description: '',
        accounting_type: 'internal',
        category: 'Outro',
        transaction_date: null,
        transaction_time: null
      });
      onTransactionAdded();
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg p-6 shadow-cyber-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <MonthSelector
          selected={selectedMonth}
          onChange={onMonthChange}
          label="Mês da Transação"
        />

        <div className="form-field">
          <label className="input-label">Montante</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neon-blue sm:text-sm">
                {formData.currency === 'EUR' ? '€' : 
                 formData.currency === 'USD' ? '$' : '£'}
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="form-input pl-7"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <CurrencySelector
                value={formData.currency}
                onChange={(currency) => setFormData({ ...formData, currency })}
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label className="input-label">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' | 'revenue' })}
            className="form-select"
          >
            <option value="expense">Despesa</option>
            <option value="revenue">Receita</option>
          </select>
        </div>

        <div className="form-field">
          <label className="input-label">Método de Pagamento</label>
          <select
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            className="form-select"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label className="input-label">Tipo de Contabilidade</label>
          <select
            value={formData.accounting_type}
            onChange={(e) => setFormData({ ...formData, accounting_type: e.target.value as 'internal' | 'external' })}
            className="form-select"
          >
            <option value="internal">Interna</option>
            <option value="external">Externa</option>
          </select>
        </div>

        <div>
          <CategorySelector
            value={formData.category}
            onChange={(category) => setFormData({ ...formData, category })}
          />
        </div>

        <div className="sm:col-span-2">
          <DescriptionAutosuggest
            value={formData.description}
            onChange={(description) => setFormData({ ...formData, description })}
          />
        </div>

        <div className="sm:col-span-2">
          <DateTimeFields
            date={formData.transaction_date}
            time={formData.transaction_time}
            onDateChange={(date) => setFormData({ ...formData, transaction_date: date })}
            onTimeChange={(time) => setFormData({ ...formData, transaction_time: time })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.has_receipt}
              onChange={(e) => setFormData({ ...formData, has_receipt: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Tem Recibo</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-md p-3">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-cyber-600/50 border border-cyber-500/50 rounded-md text-sm font-medium text-cyber-text-primary hover:bg-cyber-600/70 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-colors duration-300"
          >
            Cancelar
          </button>
        )}
        <motion.button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded-md shadow-sm text-sm font-medium text-cyber-text-primary hover:bg-neon-blue/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-colors duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {loading ? 'A guardar...' : initialData ? 'Atualizar Transação' : 'Adicionar Transação'}
        </motion.button>
      </div>
    </motion.form>
  );
}