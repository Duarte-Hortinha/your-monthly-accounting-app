import { supabase } from './supabase';
import type { DefaultCategory } from '../types/transaction';

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  'Alimentação',
  'Transportes',
  'Habitação',
  'Utilidades',
  'Saúde',
  'Entretenimento',
  'Escritório',
  'Serviços',
  'Rendimentos',
  'Outro'
];

export async function getUserCategories(userId: string) {
  const { data: categories } = await supabase
    .from('user_categories')
    .select('category')
    .eq('user_id', userId);

  return categories?.map(c => c.category) || [];
}

export async function addUserCategory(userId: string, category: string) {
  return await supabase
    .from('user_categories')
    .insert({ user_id: userId, category });
}

export async function updateUserCategory(userId: string, oldCategory: string, newCategory: string) {
  const { data, error } = await supabase.rpc('update_category', {
    p_user_id: userId,
    p_old_category: oldCategory,
    p_new_category: newCategory
  });

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return { data, error: null };
}

export async function removeUserCategory(userId: string, category: string) {
  const { data, error } = await supabase.rpc('remove_user_category', {
    p_user_id: userId,
    p_category: category
  });

  if (error) {
    console.error('Error removing category:', error);
    throw error;
  }

  return { data, error: null };
}