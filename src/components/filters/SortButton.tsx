import React from 'react';
import { ArrowUpDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

interface SortButtonProps {
  direction: SortDirection;
  onChange: (direction: SortDirection) => void;
}

export function SortButton({ direction, onChange }: SortButtonProps) {
  const handleClick = () => {
    if (direction === null) onChange('asc');
    else if (direction === 'asc') onChange('desc');
    else onChange(null);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1 rounded hover:bg-gray-100 ${direction ? 'text-blue-600' : 'text-gray-400'}`}
      title="Sort by amount"
    >
      <ArrowUpDown className="h-4 w-4" />
    </button>
  );
}