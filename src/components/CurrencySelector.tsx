import React from 'react';
import type { CurrencyCode } from '../types/transaction';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  className?: string;
}

export function CurrencySelector({ value, onChange, className = '' }: CurrencySelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CurrencyCode)}
      className={`h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-neon-blue hover:text-neon-blue/80 transition-colors duration-300 cursor-pointer focus:ring-0 focus:outline-none ${className}`}
    >
      <option value="EUR" className="bg-cyber-700 text-cyber-text-primary">EUR</option>
      <option value="USD" className="bg-cyber-700 text-cyber-text-primary">USD</option>
      <option value="GBP" className="bg-cyber-700 text-cyber-text-primary">GBP</option>
    </select>
  );
}