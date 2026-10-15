import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { SectorAllocation } from '../../types';
import { formatINR } from '../../utils/formatters';

interface SectorPieChartProps {
  data: SectorAllocation[];
  height?: number;
}

const SECTOR_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
];

export const SectorPieChart: React.FC<SectorPieChartProps> = ({
  data,
  height = 280,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-slate-500 border border-slate-800 rounded-xl"
        style={{ height }}
      >
        No sector allocation data available
      </div>
    );
  }

  // Filter out any 0 value entries for clean visualization
  const filteredData = data.filter((d) => d.value > 0);

  if (filteredData.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-slate-500 border border-slate-800 rounded-xl"
        style={{ height }}
      >
        No invested holdings to calculate sector allocation
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            nameKey="sector"
          >
            {filteredData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                stroke="#0f172a"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as SectorAllocation;
                return (
                  <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs">
                    <p className="font-semibold text-slate-200">{item.sector}</p>
                    <p className="text-emerald-400 font-mono mt-1">
                      {formatINR(item.value)} ({item.percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => (
              <span className="text-xs text-slate-300 mr-2">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
