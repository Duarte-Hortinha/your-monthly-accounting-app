import React from 'react';
import { Wallet, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from '../lib/auth';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  userEmail?: string | null;
  onSignOut: () => void;
}

export function Header({ userEmail, onSignOut }: HeaderProps) {
  async function handleSignOut() {
    const { error } = await signOut();
    if (!error) onSignOut();
  }

  return (
    <motion.header 
      className="bg-cyber-700/30 backdrop-blur-sm border-b border-cyber-500/50 shadow-cyber-md relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold text-cyber-text-primary flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <Wallet className="w-8 h-8 mr-3 text-neon-blue" />
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Contabilidade Pessoal
            </span>
          </motion.h1>
          
          {userEmail && (
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center text-sm text-cyber-text-secondary bg-cyber-600/30 px-4 py-2 rounded-md border border-cyber-500/30"
                whileHover={{ scale: 1.02 }}
              >
                <User className="w-4 h-4 mr-2 text-neon-blue" />
                <span>{userEmail}</span>
              </motion.div>
              <ThemeToggle />
              <motion.button
                onClick={handleSignOut}
                className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors duration-300"
                title="Terminar Sessão"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}