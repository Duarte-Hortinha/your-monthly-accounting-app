import React from 'react';
import { MonthPicker } from './MonthPicker';
import type { MonthSelection } from '../types/date';

interface MonthSelectorProps {
  selected: MonthSelection;
  onChange: (selection: MonthSelection) => void;
  label?: string;
}

export function MonthSelector({ selected, onChange, label = 'Month' }: MonthSelectorProps) {
  return (
    <div className="form-field">
      <label className="text-sm font-medium text-neon-blue mb-1 block">
        {label}
      </label>
      <MonthPicker selected={selected} onChange={onChange} />
    </div>
  );
}