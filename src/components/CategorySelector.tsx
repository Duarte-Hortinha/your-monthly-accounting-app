import React, { useState, useEffect, useRef } from 'react';
import { Tag } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../lib/categories';
import { getUserCategories } from '../lib/categories';
import { supabase } from '../lib/supabase';

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadUserCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadUserCategories() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const userCategories = await getUserCategories(user.id);
    setCustomCategories(userCategories);
  }

  return (
    <div className="form-field">
      <label className="input-label">Categoria</label>
      <div className="mt-1 relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-cyber-600/50 border border-cyber-500/50 rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-neon-blue/50 focus:border-neon-blue/50"
        >
          <div className="flex items-center">
            <Tag className="w-4 h-4 text-neon-blue mr-2" />
            <span className="block truncate text-cyber-text-primary">{value}</span>
          </div>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-4 w-4 text-cyber-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div 
            ref={dropdownRef}
            className="cyber-dropdown"
          >
            {/* Default Categories */}
            <div className="p-2 border-b border-cyber-500/50">
              <div className="text-xs font-medium text-cyber-text-secondary mb-1">Categorias Padrão</div>
              {DEFAULT_CATEGORIES.map(category => (
                <div
                  key={category}
                  className={`cyber-dropdown-item ${
                    value === category ? 'active' : ''
                  }`}
                  onClick={() => {
                    onChange(category);
                    setIsOpen(false);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>

            {/* Custom Categories */}
            {customCategories.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-cyber-text-secondary mb-1">Minhas Categorias</div>
                {customCategories.map(category => (
                  <div
                    key={category}
                    className={`cyber-dropdown-item ${
                      value === category ? 'active' : ''
                    }`}
                    onClick={() => {
                      onChange(category);
                      setIsOpen(false);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}