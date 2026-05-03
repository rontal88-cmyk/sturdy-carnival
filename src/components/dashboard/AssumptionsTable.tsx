import type { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import { formatCurrency, formatNumber, SOURCE_LABELS } from '@/utils/formatters';
import { calcMetricAnnualImpact, calcMetricEconomicValue } from '@/utils/calculations';

const CONFIDENCE_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  high: 'success',
  medium: 'warning',
  low: 'danger',
};

interface AssumptionsTableProps {
  project: Project;
}

export function AssumptionsTable({ project }: AssumptionsTableProps) {
  const rows = project.impactAreas
    .filter((a) => a.selected && a.metrics.length > 0)
    .flatMap((area) => {
      const template = IMPACT_AREA_TEMPLATES.find((t) => t.id === area.id)!;
      return area.metrics.map((metric) => ({
        area: template.label,
        areaIcon: template.icon,
        metric: metric.name,
        unit: metric.unit,
        baseline: metric.baselineValue,
        changePct: metric.expectedChangePct,
        population: metric.populationSize,
        timeframe: metric.timeframeMonths,
        costPerUnit: metric.costPerUnit,
        annualImpact: calcMetricAnnualImpact(metric),
        economicValue: calcMetricEconomicValue(metric),
        confidence: metric.confidenceLevel,
        source: metric.assumptionSource,
        notes: metric.notes,
      }));
    });

  if (rows.length === 0) {
    return <p className="text-muted-foreground text-sm">No metrics added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="pb-2 pr-4">Impact Area</th>
            <th className="pb-2 pr-4">Metric</th>
            <th className="pb-2 pr-4 text-right">Baseline</th>
            <th className="pb-2 pr-4 text-right">Change</th>
            <th className="pb-2 pr-4 text-right">Population</th>
            <th className="pb-2 pr-4 text-right">Annual Impact</th>
            <th className="pb-2 pr-4 text-right">Value/Year</th>
            <th className="pb-2 pr-4">Confidence</th>
            <th className="pb-2">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="py-2.5 pr-4 whitespace-nowrap">
                <span className="mr-1">{row.areaIcon}</span>
                <span className="text-xs text-muted-foreground">{row.area}</span>
              </td>
              <td className="py-2.5 pr-4">
                <div className="font-medium text-foreground">{row.metric}</div>
                {row.notes && (
                  <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate" title={row.notes}>
                    {row.notes}
                  </div>
                )}
              </td>
              <td className="py-2.5 pr-4 text-right text-muted-foreground">
                {formatNumber(row.baseline, 2)}<br />
                <span className="text-xs">{row.unit}</span>
              </td>
              <td className="py-2.5 pr-4 text-right font-semibold text-primary">
                -{row.changePct}%
              </td>
              <td className="py-2.5 pr-4 text-right">
                {formatNumber(row.population, 0)}
              </td>
              <td className="py-2.5 pr-4 text-right">
                {formatNumber(row.annualImpact, 1)}<br />
                <span className="text-xs text-muted-foreground">{row.unit}</span>
              </td>
              <td className="py-2.5 pr-4 text-right font-semibold">
                {formatCurrency(row.economicValue, true)}
              </td>
              <td className="py-2.5 pr-4">
                <Badge variant={CONFIDENCE_VARIANT[row.confidence]}>
                  {row.confidence.charAt(0).toUpperCase() + row.confidence.slice(1)}
                </Badge>
              </td>
              <td className="py-2.5">
                <span className="text-xs text-muted-foreground">{SOURCE_LABELS[row.source]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
