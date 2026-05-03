import {
  LineChart,
  Line,
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

interface TimelineChartProps {
  results: CalculationResults;
}

export function TimelineChart({ results }: TimelineChartProps) {
  const { scenarios } = results;

  const data = [
    { year: 'Year 0', Conservative: 0, Realistic: 0, Optimistic: 0 },
    {
      year: 'Year 1',
      Conservative: scenarios.conservative.year1,
      Realistic: scenarios.realistic.year1,
      Optimistic: scenarios.optimistic.year1,
    },
    {
      year: 'Year 3',
      Conservative: scenarios.conservative.year3,
      Realistic: scenarios.realistic.year3,
      Optimistic: scenarios.optimistic.year3,
    },
    {
      year: 'Year 5',
      Conservative: scenarios.conservative.year5,
      Realistic: scenarios.realistic.year5,
      Optimistic: scenarios.optimistic.year5,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v: number) => formatCurrency(v, true)} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
        <Legend />
        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="Conservative" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Realistic" stroke="#14b8a6" strokeWidth={3} dot={{ r: 5 }} />
        <Line type="monotone" dataKey="Optimistic" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
