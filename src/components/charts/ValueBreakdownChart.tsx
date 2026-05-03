import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ImpactAreaResult } from '@/types';
import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import { formatCurrency } from '@/utils/formatters';

const CHART_COLORS = [
  '#14b8a6', '#3b82f6', '#f97316', '#a855f7',
  '#6366f1', '#f43f5e', '#22c55e', '#06b6d4',
  '#f59e0b', '#8b5cf6',
];

interface ValueBreakdownChartProps {
  impactAreaResults: ImpactAreaResult[];
}

export function ValueBreakdownChart({ impactAreaResults }: ValueBreakdownChartProps) {
  const data = impactAreaResults
    .filter((r) => r.totalValue > 0)
    .map((r) => {
      const template = IMPACT_AREA_TEMPLATES.find((t) => t.id === r.areaId)!;
      return {
        name: template.label,
        icon: template.icon,
        value: r.totalValue,
        pct: r.pctOfTotal,
      };
    })
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No economic value estimated yet. Add metrics with cost per unit to see breakdown.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), 'Annual Value']}
          labelFormatter={(label) => label}
        />
        <Legend
          formatter={(value, _entry) => {
            const item = data.find((d) => d.name === value);
            return `${item?.icon ?? ''} ${value} (${item?.pct.toFixed(0)}%)`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
