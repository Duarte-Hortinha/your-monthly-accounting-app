import React from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <motion.div 
      className="bg-cyber-600/30 border border-cyber-500/30 rounded-lg p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="text-lg font-medium text-neon-blue mb-4">{title}</h4>
      {children}
    </motion.div>
  );
}