import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChartContainer } from './ChartContainer';
import { DoughnutChart } from './DoughnutChart';
import { Toggle } from '../common/Toggle';
import type { Transaction } from '../../types/transaction';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const [accountingType, setAccountingType] = useState<'internal' | 'external'>('internal');

  const filteredTransactions = transactions.filter(
    t => t.accounting_type === accountingType
  );

  const expenseTotals = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const amount = Math.abs(t.amount);
      acc[t.category] = (acc[t.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const revenueTotals = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <motion.div 
      className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg p-6 shadow-cyber-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-cyber-text-primary flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-neon-blue" />
          Distribuição por Categoria
        </h3>
        
        <Toggle
          value={accountingType}
          onChange={(value) => setAccountingType(value as 'internal' | 'external')}
          options={[
            { value: 'internal', label: 'Interna' },
            { value: 'external', label: 'Externa' }
          ]}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChartContainer title={`Despesas ${accountingType === 'internal' ? 'Internas' : 'Externas'} por Categoria`}>
          <DoughnutChart data={expenseTotals} />
        </ChartContainer>

        <ChartContainer title={`Receitas ${accountingType === 'internal' ? 'Internas' : 'Externas'} por Categoria`}>
          <DoughnutChart data={revenueTotals} />
        </ChartContainer>
      </div>
    </motion.div>
  );
}