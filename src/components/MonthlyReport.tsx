import React from 'react';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { BarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryBreakdown } from './charts/CategoryBreakdown';
import type { Transaction } from '../types/transaction';
import type { MonthSelection } from '../types/date';

interface MonthlyReportProps {
  transactions: Transaction[];
  selectedMonth: MonthSelection;
  showAllTime: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function MonthlyReport({ transactions, selectedMonth, showAllTime }: MonthlyReportProps) {
  const calculateTotals = (filterFn: (t: Transaction) => boolean) => {
    const filtered = transactions.filter(filterFn);
    const expenses = filtered
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.eur_amount), 0);
    const revenues = filtered
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.eur_amount, 0);
    return { expenses, revenues, profit: revenues - expenses };
  };

  const internalTotals = calculateTotals(t => t.accounting_type === 'internal');
  const externalTotals = calculateTotals(t => t.accounting_type === 'external');

  const reportDate = new Date(selectedMonth.year, selectedMonth.month);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg p-6 shadow-cyber-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyber-text-primary flex items-center">
            <BarChart className="w-7 h-7 mr-3 text-neon-blue" />
            {showAllTime ? 'Relatório Total' : `Relatório Mensal - ${format(reportDate, 'MMMM yyyy', { locale: pt })}`}
          </h2>
          <div className="text-sm text-neon-blue">
            Valores em EUR
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Internal Accounting */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-blue">Contabilidade Interna</h3>
            <div className="bg-cyber-600/30 border border-cyber-500/30 p-4 rounded-lg">
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-cyber-text-primary flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
                    Total de Despesas:
                  </dt>
                  <dd className="font-medium text-red-400">
                    €{internalTotals.expenses.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-cyber-text-primary flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                    Total de Receitas:
                  </dt>
                  <dd className="font-medium text-green-400">
                    €{internalTotals.revenues.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-cyber-500/30">
                  <dt className="font-semibold text-cyber-text-primary">Lucro/Prejuízo:</dt>
                  <dd className={`font-bold ${
                    internalTotals.profit >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    €{internalTotals.profit.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>

          {/* External Accounting */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-purple">Contabilidade Externa</h3>
            <div className="bg-cyber-600/30 border border-cyber-500/30 p-4 rounded-lg">
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-cyber-text-primary flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2 text-red-400" />
                    Total de Despesas:
                  </dt>
                  <dd className="font-medium text-red-400">
                    €{externalTotals.expenses.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-cyber-text-primary flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                    Total de Receitas:
                  </dt>
                  <dd className="font-medium text-green-400">
                    €{externalTotals.revenues.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-cyber-500/30">
                  <dt className="font-semibold text-cyber-text-primary">Lucro/Prejuízo:</dt>
                  <dd className={`font-bold ${
                    externalTotals.profit >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    €{externalTotals.profit.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <CategoryBreakdown transactions={transactions} />
      </motion.div>
    </motion.div>
  );
}