import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, Trash2, X, Tags } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserCategories, addUserCategory, removeUserCategory, updateUserCategory } from '../../lib/categories';
import { supabase } from '../../lib/supabase';
import { PaymentMethodManager } from './PaymentMethodManager';
import type { User } from '@supabase/supabase-js';

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function CategoryManager() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{original: string, new: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function loadCategories() {
    if (!user) return;
    const userCategories = await getUserCategories(user.id);
    setCategories(userCategories);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newCategory.trim()) return;

    try {
      await addUserCategory(user.id, newCategory.trim());
      await loadCategories();
      setNewCategory('');
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar categoria');
      console.error('Error adding category:', err);
    }
  }

  async function handleUpdateCategory(originalCategory: string) {
    if (!user || !editingCategory || !editingCategory.new.trim()) return;

    try {
      await updateUserCategory(user.id, originalCategory, editingCategory.new.trim());
      await loadCategories();
      setEditingCategory(null);
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar categoria');
      console.error('Error updating category:', err);
    }
  }

  async function handleDeleteCategory(category: string) {
    if (!user) return;
    
    if (!window.confirm('Tem certeza que deseja eliminar esta categoria? As transações existentes serão movidas para a categoria "Outro".')) {
      return;
    }

    try {
      await removeUserCategory(user.id, category);
      await loadCategories();
      setError(null);
    } catch (err) {
      setError('Erro ao eliminar categoria');
      console.error('Error removing category:', err);
    }
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg p-6 shadow-cyber-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Tags className="w-6 h-6 text-neon-blue" />
          <h2 className="text-xl font-semibold text-cyber-text-primary">
            Gestão de Categorias
          </h2>
        </div>

        {/* Add New Category */}
        <form onSubmit={handleAddCategory} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nova categoria..."
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

        {/* Categories List */}
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
          {categories.map(category => (
            <motion.div
              key={category}
              variants={listItemVariants}
              className="flex items-center justify-between p-3 bg-cyber-600/30 border border-cyber-500/30 rounded-md group hover:border-cyber-500/50 transition-colors duration-300"
            >
              {editingCategory?.original === category ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingCategory.new}
                    onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                    className="flex-1 bg-cyber-600/50 border border-cyber-500/50 rounded-md text-cyber-text-primary focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50"
                    autoFocus
                  />
                  <motion.button
                    onClick={() => handleUpdateCategory(category)}
                    className="p-2 text-neon-cyan hover:text-neon-cyan/80"
                    title="Guardar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Save className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingCategory(null)}
                    className="p-2 text-cyber-text-secondary hover:text-cyber-text-primary"
                    title="Cancelar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <span className="text-cyber-text-primary">{category}</span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      onClick={() => setEditingCategory({ original: category, new: category })}
                      className="p-2 text-neon-blue hover:text-neon-blue/80"
                      title="Editar"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-red-400 hover:text-red-300"
                      title="Eliminar"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </>
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

      <PaymentMethodManager />
    </div>
  );
}