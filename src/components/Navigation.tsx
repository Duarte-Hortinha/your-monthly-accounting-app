import React from 'react';
import { PlusCircle, BarChart, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'add', label: 'Adicionar Transação', icon: PlusCircle },
    { id: 'overview', label: 'Visão Mensal', icon: BarChart },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'settings', label: 'Personalização', icon: Settings },
  ];

  return (
    <nav className="bg-cyber-700/30 backdrop-blur-sm border-b border-cyber-500/50 shadow-cyber-md mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => onViewChange(id)}
              className={`
                relative flex items-center px-4 py-4 text-sm font-medium
                transition-colors duration-300
                ${activeView === id
                  ? 'text-neon-blue'
                  : 'text-cyber-text-secondary hover:text-cyber-text-primary'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeView === id && (
                <motion.div
                  className="absolute inset-0 border-b-2 border-neon-blue"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center space-x-2">
                <Icon className={`w-5 h-5 ${
                  activeView === id 
                    ? 'text-neon-blue'
                    : 'text-cyber-text-secondary group-hover:text-cyber-text-primary'
                }`} />
                <span className={`relative z-10 ${
                  activeView === id
                    ? 'text-glow-sm'
                    : ''
                }`}>
                  {label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}