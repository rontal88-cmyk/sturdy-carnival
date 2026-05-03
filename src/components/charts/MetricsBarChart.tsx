import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MetricResult } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const CONFIDENCE_COLORS: Record<string, string> = {
  high: '#22c55e',
  medium: '#f59e0b',
  low: '#ef4444',
};

interface MetricsBarChartProps {
  metricResults: MetricResult[];
}

export function MetricsBarChart({ metricResults }: MetricsBarChartProps) {
  const data = [...metricResults]
    .sort((a, b) => b.economicValue - a.economicValue)
    .slice(0, 10)
    .map((m) => ({
      name: m.metricName.length > 25 ? m.metricName.slice(0, 25) + '…' : m.metricName,
      fullName: m.metricName,
      value: m.economicValue,
      confidence: m.confidenceLevel,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No metric economic values yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 45)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
        <XAxis type="number" tickFormatter={(v: number) => formatCurrency(v, true)} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), 'Annual Value']}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={CONFIDENCE_COLORS[entry.confidence] ?? '#14b8a6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
