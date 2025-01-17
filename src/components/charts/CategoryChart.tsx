import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import type { Transaction } from '../../types/transaction';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const categoryTotals = transactions.reduce((acc, t) => {
    const amount = Math.abs(t.amount);
    acc[t.category] = (acc[t.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a);

  const data: ChartData<'doughnut'> = {
    labels: sortedCategories.map(([category]) => category),
    datasets: [{
      data: sortedCategories.map(([, amount]) => amount),
      backgroundColor: [
        '#3B82F6', // blue-500
        '#EF4444', // red-500
        '#10B981', // emerald-500
        '#F59E0B', // amber-500
        '#6366F1', // indigo-500
        '#EC4899', // pink-500
        '#8B5CF6', // violet-500
        '#14B8A6', // teal-500
        '#F97316', // orange-500
        '#6B7280', // gray-500
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `€${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}