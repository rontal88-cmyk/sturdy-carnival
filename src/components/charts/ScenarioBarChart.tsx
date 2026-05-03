import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { CalculationResults } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ScenarioBarChartProps {
  results: CalculationResults;
}

export function ScenarioBarChart({ results }: ScenarioBarChartProps) {
  const data = [
    {
      name: 'Conservative',
      'Total Benefit': results.scenarios.conservative.totalBenefit,
      'Net Value': results.scenarios.conservative.netValue,
    },
    {
      name: 'Realistic',
      'Total Benefit': results.scenarios.realistic.totalBenefit,
      'Net Value': results.scenarios.realistic.netValue,
    },
    {
      name: 'Optimistic',
      'Total Benefit': results.scenarios.optimistic.totalBenefit,
      'Net Value': results.scenarios.optimistic.netValue,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v: number) => formatCurrency(v, true)} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
        <Legend />
        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
        <Bar dataKey="Total Benefit" fill="#14b8a6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Net Value" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
