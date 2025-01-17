import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const DEFAULT_PAYMENT_METHODS = ['Dinheiro', 'Santander/MB Way', 'Monese', 'Revolut'];

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function PaymentMethodManager() {
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [newMethod, setNewMethod] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  async function handleAddMethod(e: React.FormEvent) {
    e.preventDefault();
    if (!newMethod.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if method already exists
    if (paymentMethods.includes(newMethod.trim())) {
      setError('Este método de pagamento já existe');
      return;
    }

    // Check if it's a default method
    if (DEFAULT_PAYMENT_METHODS.includes(newMethod.trim())) {
      setError('Não pode adicionar um método de pagamento padrão');
      return;
    }

    try {
      const { error } = await supabase.rpc('add_payment_method', {
        p_user_id: user.id,
        p_name: newMethod.trim()
      });

      if (error) throw error;

      await loadPaymentMethods();
      setNewMethod('');
      setError(null);
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError('Erro ao adicionar método de pagamento');
    }
  }

  async function handleDeleteMethod(method: string) {
    if (DEFAULT_PAYMENT_METHODS.includes(method)) {
      setError('Não pode eliminar métodos de pagamento padrão');
      return;
    }

    if (!window.confirm('Tem certeza que deseja eliminar este método de pagamento?')) {
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.rpc('remove_payment_method', {
        p_user_id: user.id,
        p_name: method
      });

      if (error) throw error;

      await loadPaymentMethods();
      setError(null);
    } catch (err) {
      console.error('Error removing payment method:', err);
      setError('Erro ao eliminar método de pagamento');
    }
  }

  return (
    <motion.div 
      className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg p-6 shadow-cyber-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="w-6 h-6 text-neon-blue" />
        <h2 className="text-xl font-semibold text-cyber-text-primary">
          Gestão de Métodos de Pagamento
        </h2>
      </div>

      {/* Add New Method */}
      <form onSubmit={handleAddMethod} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)}
            placeholder="Novo método de pagamento..."
            className="flex-1 bg-cyber-600/50 border border-cyber-500/50 rounded-md text-cyber-text-primary placeholder-cyber-text-secondary/50 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 shadow-cyber-sm"
          />
          <motion.button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded-md shadow-sm text-sm font-medium text-cyber-text-primary hover:bg-neon-blue/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </motion.button>
        </div>
      </form>

      {/* Methods List */}
      <motion.div 
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {paymentMethods.map(method => (
          <motion.div
            key={method}
            variants={listItemVariants}
            className="flex items-center justify-between p-3 bg-cyber-600/30 border border-cyber-500/30 rounded-md group hover:border-cyber-500/50 transition-colors duration-300"
          >
            <span className="text-cyber-text-primary">{method}</span>
            {!DEFAULT_PAYMENT_METHODS.includes(method) && (
              <motion.button
                onClick={() => handleDeleteMethod(method)}
                className="p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Eliminar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {error && (
        <motion.div 
          className="mt-4 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-md p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}