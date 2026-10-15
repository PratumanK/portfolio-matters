import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatINR } from '../../utils/formatters';

interface PerformanceDataPoint {
  name: string;
  value: number;
}

interface PerformanceBarChartProps {
  data: PerformanceDataPoint[];
  height?: number;
}

export const PerformanceBarChart: React.FC<PerformanceBarChartProps> = ({
  data,
  height = 240,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-slate-500 border border-slate-800 rounded-xl"
        style={{ height }}
      >
        No comparative data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as PerformanceDataPoint;
                return (
                  <div className="bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg shadow-xl text-xs">
                    <p className="font-medium text-slate-300">{item.name}</p>
                    <p className="text-slate-100 font-mono font-bold mt-0.5">
                      {formatINR(item.value)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={
                  entry.name.toLowerCase().includes('profit')
                    ? entry.value >= 0
                      ? '#10b981'
                      : '#f43f5e'
                    : entry.name.toLowerCase().includes('invested')
                    ? '#6366f1'
                    : '#06b6d4'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
