import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeFieldsProps {
  date: string | null;
  time: string | null;
  onDateChange: (date: string | null) => void;
  onTimeChange: (time: string | null) => void;
}

export function DateTimeFields({ date, time, onDateChange, onTimeChange }: DateTimeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="form-field">
        <label className="input-label">Data (Opcional)</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-neon-blue" />
          </div>
          <input
            type="date"
            value={date || ''}
            onChange={(e) => onDateChange(e.target.value || null)}
            className="form-input pl-10 appearance-none"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>
      <div className="form-field">
        <label className="input-label">Hora (Opcional)</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-neon-blue" />
          </div>
          <input
            type="time"
            value={time || ''}
            onChange={(e) => onTimeChange(e.target.value || null)}
            className="form-input pl-10 appearance-none"
            style={{ colorScheme: 'dark' }}
          />
        </div>
      </div>
    </div>
  );
}