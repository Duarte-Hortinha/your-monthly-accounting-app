import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  '#00F3FF', // neon-blue
  '#BD00FF', // neon-purple
  '#00FFD1', // neon-cyan
  '#FF3D71', // neon-red
  '#FFD93D', // neon-yellow
  '#6EE7B7', // neon-green
  '#818CF8', // neon-indigo
  '#F472B6', // neon-pink
  '#FB923C', // neon-orange
  '#94A3B8', // slate-400
];

interface DoughnutChartProps {
  data: Record<string, number>;
}

export function DoughnutChart({ data }: DoughnutChartProps) {
  const sortedEntries = Object.entries(data).sort(([, a], [, b]) => b - a);

  const chartData: ChartData<'doughnut'> = {
    labels: sortedEntries.map(([label]) => label),
    datasets: [{
      data: sortedEntries.map(([, value]) => value),
      backgroundColor: CHART_COLORS,
      borderWidth: 2,
      borderColor: '#1A1D25',
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { 
            size: 14,
            family: 'Poppins',
            weight: '600'
          },
          color: '#FFFFFF',
          padding: 20,
          boxWidth: 24,
          boxHeight: 24,
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label: string, i: number) => ({
              text: `${label} (€${datasets[0].data[i].toFixed(2)})`,
              fillStyle: CHART_COLORS[i],
              strokeStyle: CHART_COLORS[i],
              lineWidth: 2,
              hidden: false,
              index: i,
              textAlign: 'left'
            }));
          },
          usePointStyle: true,
          pointStyle: 'circle',
          filter: (item: any) => item.text !== '',
        },
        align: 'center',
        fullSize: true,
        display: true,
        labels: {
          render: 'label',
          position: 'left'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `€${context.raw.toFixed(2)}`,
        },
        backgroundColor: '#1A1D25',
        titleColor: '#00F3FF',
        bodyColor: '#FFFFFF',
        borderColor: '#2A2F3A',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        }
      },
    },
    layout: {
      padding: {
        right: 140 // Increased padding for legend
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[300px] flex items-center justify-center bg-cyber-700/95 rounded-lg p-8">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}