import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Pencil, Trash2, ArrowUpDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchBar } from './search/SearchBar';
import { PaymentMethodFilter } from './filters/PaymentMethodFilter';
import { CurrencySelector } from './CurrencySelector';
import { searchTransactions } from '../utils/transactions';
import { sortTransactions, type SortConfig, type SortField } from '../utils/sorting';
import type { Transaction, PaymentMethod, CurrencyCode } from '../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>('EUR');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc'
  });

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => 
      selectedPaymentMethods.length === 0 || selectedPaymentMethods.includes(t.payment_method)
    );
    
    if (displayCurrency !== 'EUR') {
      filtered = filtered.filter(t => t.currency === displayCurrency);
    }
    
    const searched = searchTransactions(filtered, searchTerm);
    return sortTransactions(searched, sortConfig);
  }, [transactions, selectedPaymentMethods, searchTerm, sortConfig, displayCurrency]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: 
        current.field === field
          ? current.direction === null
            ? 'asc'
            : current.direction === 'asc'
              ? 'desc'
              : null
          : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return 'text-cyber-text-secondary';
    if (!sortConfig.direction) return 'text-cyber-text-secondary';
    return 'text-neon-blue';
  };

  const formatDateTime = (transaction: Transaction) => {
    try {
      if (!transaction.transaction_date) return '';
      
      const date = format(parseISO(transaction.transaction_date), 'dd/MM/yyyy', { locale: pt });
      
      if (!transaction.transaction_time) {
        return date;
      }
      
      const time = transaction.transaction_time.split(':').slice(0, 2).join(':');
      return `${date} ${time}`;
    } catch (error) {
      console.error('Error formatting date/time:', error, transaction);
      return transaction.transaction_date || '';
    }
  };

  const getCurrencySymbol = (currency: CurrencyCode) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'USD': return '$';
      case 'GBP': return '£';
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-grow">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar por descrição, categoria ou montante..."
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neon-blue">Mostrar em:</span>
          <CurrencySelector
            value={displayCurrency}
            onChange={setDisplayCurrency}
            className="border border-cyber-500/50 rounded-md"
          />
        </div>
        <PaymentMethodFilter
          selectedMethods={selectedPaymentMethods}
          onChange={setSelectedPaymentMethods}
        />
      </div>

      <motion.div 
        className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg shadow-cyber-md overflow-hidden"
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-cyber-500/30">
            <thead className="bg-cyber-600/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-neon-blue uppercase tracking-wider">Data</span>
                    <button
                      onClick={() => handleSort('date')}
                      className={`p-1 rounded hover:bg-cyber-500/30 ${getSortIcon('date')}`}
                      title="Ordenar por data"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-blue uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-neon-blue uppercase tracking-wider">Montante</span>
                    <button
                      onClick={() => handleSort('amount')}
                      className={`p-1 rounded hover:bg-cyber-500/30 ${getSortIcon('amount')}`}
                      title="Ordenar por montante"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-blue uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-neon-blue uppercase tracking-wider">Tipo</span>
                    <button
                      onClick={() => handleSort('type')}
                      className={`p-1 rounded hover:bg-cyber-500/30 ${getSortIcon('type')}`}
                      title="Ordenar por tipo"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-blue uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neon-blue uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-500/30">
              {filteredTransactions.map((transaction) => (
                <motion.tr 
                  key={transaction.id} 
                  className="hover:bg-cyber-600/30 transition-colors duration-200"
                  variants={itemVariants}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-text-secondary">
                    {formatDateTime(transaction)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-text-primary">
                    {transaction.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <div className="flex items-center gap-1">
                      <span>{getCurrencySymbol(transaction.currency)}</span>
                      <span>{Math.abs(transaction.amount).toFixed(2)}</span>
                      {transaction.currency !== 'EUR' && (
                        <span className="text-xs text-cyber-text-secondary ml-1">
                          (€{Math.abs(transaction.eur_amount).toFixed(2)})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-text-secondary">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-text-secondary">
                    {transaction.accounting_type === 'internal' ? 'Interna' : 'Externa'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyber-text-secondary">
                    {transaction.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => onEdit(transaction)}
                        className="text-neon-blue hover:text-neon-blue/80 transition-colors duration-200"
                        title="Editar"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Pencil className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja eliminar esta transação?')) {
                            onDelete(transaction.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        title="Eliminar"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}