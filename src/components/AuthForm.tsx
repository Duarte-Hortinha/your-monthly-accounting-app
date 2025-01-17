import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { signIn, signUp } from '../lib/auth';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) throw error;
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div 
      className="max-w-md mx-auto bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg shadow-cyber-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <motion.h2 
          className="text-2xl font-bold text-neon-blue mb-6 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {isSignUp ? (
            <>
              <UserPlus className="w-6 h-6 mr-2" />
              Criar Conta
            </>
          ) : (
            <>
              <LogIn className="w-6 h-6 mr-2" />
              Iniciar Sessão
            </>
          )}
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-field">
            <label className="input-label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neon-blue" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-10"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="input-label">Palavra-passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neon-blue" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-md p-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded-md shadow-sm text-sm font-medium text-cyber-text-primary hover:bg-neon-blue/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-colors duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'A processar...' : isSignUp ? 'Criar Conta' : 'Iniciar Sessão'}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-neon-blue hover:text-neon-blue/80 transition-colors duration-300 mt-4"
            whileHover={{ scale: 1.02 }}
          >
            {isSignUp ? 'Já tem uma conta? Inicie sessão' : 'Precisa de uma conta? Registe-se'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}