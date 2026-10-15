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

interface SimulationComparisonProps {
  currentValue: number;
  projectedValue: number;
  marketChangePercent: number;
  height?: number;
}

export const SimulationComparisonChart: React.FC<SimulationComparisonProps> = ({
  currentValue,
  projectedValue,
  marketChangePercent,
  height = 240,
}) => {
  const data = [
    { name: 'Current Value', value: currentValue, isProjected: false },
    {
      name: `Simulated (${marketChangePercent > 0 ? '+' : ''}${marketChangePercent}%)`,
      value: projectedValue,
      isProjected: true,
    },
  ];

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
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
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs">
                    <p className="font-semibold text-slate-300">{item.name}</p>
                    <p className="text-slate-100 font-mono font-bold mt-1">
                      {formatINR(item.value)}
                    </p>
                    {item.isProjected && (
                      <p className="text-[10px] text-amber-400 mt-1 italic">
                        *Hypothetical projection based on simulated market shift
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            <Cell fill="#3b82f6" />
            <Cell fill={marketChangePercent >= 0 ? '#10b981' : '#f43f5e'} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
