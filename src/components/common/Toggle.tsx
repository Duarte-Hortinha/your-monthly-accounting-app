import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function Toggle({ value, onChange, options }: ToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-cyber-500/50 p-1 bg-cyber-700/30 backdrop-blur-md">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            relative px-4 py-1.5 text-sm font-medium rounded-md
            transition-colors duration-300
            ${value === option.value
              ? 'text-cyber-text-primary'
              : 'text-cyber-text-secondary hover:text-cyber-text-primary'
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {value === option.value && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-md"
              layoutId="activeOption"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}