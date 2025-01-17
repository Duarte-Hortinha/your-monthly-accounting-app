import React, { useState, useMemo } from 'react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { MonthlyReport } from './components/MonthlyReport';
import { MonthRangeSelector } from './components/MonthRangeSelector';
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CategoryManager } from './components/settings/CategoryManager';
import { ParallaxBackground } from './components/ParallaxBackground';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { getCurrentMonthSelection, isInMonthRange } from './utils/date';
import type { Transaction } from './types/transaction';
import type { MonthSelection } from './types/date';

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { transactions, loading: transactionsLoading, fetchTransactions, deleteTransaction } = useTransactions(user);
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeView, setActiveView] = useState('add');
  const [showAllTime, setShowAllTime] = useState(false);
  
  const currentMonth = getCurrentMonthSelection();
  const [startMonth, setStartMonth] = useState<MonthSelection>(currentMonth);
  const [endMonth, setEndMonth] = useState<MonthSelection>(currentMonth);
  const [selectedMonth, setSelectedMonth] = useState<MonthSelection>(currentMonth);

  const filteredTransactions = useMemo(() => 
    transactions.filter(t => 
      isInMonthRange(t.transaction_date, startMonth, endMonth, showAllTime)
    ),
    [transactions, startMonth, endMonth, showAllTime]
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cyber-800 flex items-center justify-center">
        <div className="text-cyber-text-primary">A carregar...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cyber-800 py-12">
        <ParallaxBackground />
        <AuthForm onAuthSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-800">
      <ParallaxBackground />
      <Header userEmail={user.email} onSignOut={signOut} />
      <Navigation activeView={activeView} onViewChange={setActiveView} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeView !== 'add' && activeView !== 'settings' && (
            <MonthRangeSelector
              startMonth={startMonth}
              endMonth={endMonth}
              onStartChange={setStartMonth}
              onEndChange={setEndMonth}
              showAllTime={showAllTime}
              onShowAllTimeChange={setShowAllTime}
            />
          )}

          {transactionsLoading ? (
            <div className="mt-6 text-center text-cyber-text-primary">A carregar transações...</div>
          ) : (
            <>
              {activeView === 'add' && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4 text-cyber-text-primary">
                    {editingTransaction ? 'Editar Transação' : 'Adicionar Transação'}
                  </h2>
                  <TransactionForm
                    onTransactionAdded={() => {
                      fetchTransactions();
                      setEditingTransaction(null);
                    }}
                    initialData={editingTransaction}
                    onCancel={editingTransaction ? () => setEditingTransaction(null) : undefined}
                    selectedMonth={selectedMonth}
                    onMonthChange={setSelectedMonth}
                  />
                </div>
              )}

              {activeView === 'overview' && (
                <div className="mt-6">
                  <MonthlyReport 
                    transactions={filteredTransactions} 
                    selectedMonth={showAllTime ? currentMonth : startMonth}
                    showAllTime={showAllTime}
                  />
                </div>
              )}

              {activeView === 'history' && (
                <div className="mt-6">
                  <TransactionList
                    transactions={filteredTransactions}
                    onEdit={(transaction) => {
                      setEditingTransaction(transaction);
                      setActiveView('add');
                    }}
                    onDelete={deleteTransaction}
                  />
                </div>
              )}

              {activeView === 'settings' && (
                <div className="mt-6">
                  <CategoryManager />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}