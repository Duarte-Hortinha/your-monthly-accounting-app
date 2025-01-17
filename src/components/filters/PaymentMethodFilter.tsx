import React from 'react';
import type { PaymentMethod } from '../../types/transaction';

const PAYMENT_METHODS: PaymentMethod[] = ['Santander/MB Way', 'Monese', 'Revolut', 'Dinheiro'];

interface PaymentMethodFilterProps {
  selectedMethods: PaymentMethod[];
  onChange: (methods: PaymentMethod[]) => void;
}

export function PaymentMethodFilter({ selectedMethods, onChange }: PaymentMethodFilterProps) {
  const toggleMethod = (method: PaymentMethod) => {
    if (selectedMethods.includes(method)) {
      onChange(selectedMethods.filter(m => m !== method));
    } else {
      onChange([...selectedMethods, method]);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
      <div className="text-sm font-medium text-gray-700 mb-2">Métodos de Pagamento</div>
      <div className="space-y-2">
        {PAYMENT_METHODS.map(method => (
          <label key={method} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedMethods.includes(method)}
              onChange={() => toggleMethod(method)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">{method}</span>
          </label>
        ))}
      </div>
    </div>
  );
}