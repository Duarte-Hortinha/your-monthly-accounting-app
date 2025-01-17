import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownPortal } from './DropdownPortal';
import { getMonthName } from '../utils/date';
import type { MonthSelection } from '../types/date';

interface MonthPickerProps {
  selected: MonthSelection;
  onChange: (selection: MonthSelection) => void;
}

export function MonthPicker({ selected, onChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(selected.year);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setDisplayYear(selected.year);
    }
  }, [isOpen, selected.year]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: getMonthName(i)
  }));

  const handleYearChange = (increment: number) => {
    setDisplayYear(prev => prev + increment);
  };

  const handleSelection = (month: number) => {
    onChange({ month, year: displayYear });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-cyber-700/30 border border-cyber-500/50 rounded-lg hover:bg-cyber-600/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Calendar className="w-5 h-5 text-neon-blue" />
        <span className="text-cyber-text-primary">
          {getMonthName(selected.month)} {selected.year}
        </span>
      </motion.button>

      <DropdownPortal
        triggerRef={buttonRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="bg-cyber-700/95 backdrop-blur-sm border border-cyber-500/50 rounded-lg shadow-cyber-md overflow-hidden min-w-[300px]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ width: 'max-content' }}
            >
              <div className="p-3 border-b border-cyber-500/50">
                <div className="flex justify-between items-center">
                  <motion.button
                    type="button"
                    onClick={() => handleYearChange(-1)}
                    className="p-2 hover:bg-cyber-600/50 rounded text-neon-blue"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ←
                  </motion.button>
                  <span className="font-medium text-cyber-text-primary">{displayYear}</span>
                  <motion.button
                    type="button"
                    onClick={() => handleYearChange(1)}
                    className="p-2 hover:bg-cyber-600/50 rounded text-neon-blue"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    →
                  </motion.button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 p-3">
                {months.map(({ value, label }) => (
                  <motion.button
                    key={value}
                    type="button"
                    onClick={() => handleSelection(value)}
                    className={`
                      p-2.5 text-sm rounded transition-colors duration-300 w-full
                      ${selected.month === value && selected.year === displayYear
                        ? 'bg-neon-blue/20 text-neon-blue'
                        : 'hover:bg-cyber-600/50 text-cyber-text-secondary hover:text-cyber-text-primary'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownPortal>
    </div>
  );
}