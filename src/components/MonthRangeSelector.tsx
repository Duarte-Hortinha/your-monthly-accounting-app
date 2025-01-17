import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { MonthPicker } from './MonthPicker';
import { Toggle } from './common/Toggle';
import type { MonthSelection } from '../types/date';

interface MonthRangeProps {
  startMonth: MonthSelection;
  endMonth: MonthSelection;
  onStartChange: (month: MonthSelection) => void;
  onEndChange: (month: MonthSelection) => void;
  showAllTime: boolean;
  onShowAllTimeChange: (value: boolean) => void;
}

export function MonthRangeSelector({
  startMonth,
  endMonth,
  onStartChange,
  onEndChange,
  showAllTime,
  onShowAllTimeChange
}: MonthRangeProps) {
  return (
    <motion.div 
      className="bg-cyber-700/30 backdrop-blur-sm border border-cyber-500/50 rounded-lg p-6 shadow-cyber-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-neon-blue" />
          <span className="text-neon-blue font-medium">Período</span>
        </div>
        <Toggle
          value={showAllTime ? 'all' : 'range'}
          onChange={(value) => onShowAllTimeChange(value === 'all')}
          options={[
            { value: 'range', label: 'Intervalo' },
            { value: 'all', label: 'Todo o Período' }
          ]}
        />
      </div>

      {!showAllTime && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-neon-blue text-sm font-medium mb-2">De</label>
              <MonthPicker selected={startMonth} onChange={onStartChange} />
            </div>
            <div>
              <label className="block text-neon-blue text-sm font-medium mb-2">Até</label>
              <MonthPicker selected={endMonth} onChange={onEndChange} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}