import type {
  Project,
  MetricEstimate,
  CalculationResults,
  ImpactAreaId,
  ScenarioType,
  ScenarioResult,
} from '@/types';

const SCENARIO_MULTIPLIERS: Record<ScenarioType, number> = {
  conservative: 0.6,
  realistic: 1.0,
  optimistic: 1.4,
};

export function calcMetricAnnualImpact(metric: MetricEstimate): number {
  return (
    metric.baselineValue *
    (metric.expectedChangePct / 100) *
    metric.populationSize *
    (12 / metric.timeframeMonths)
  );
}

export function calcMetricEconomicValue(metric: MetricEstimate): number {
  return calcMetricAnnualImpact(metric) * metric.costPerUnit;
}

export function calculateResults(project: Project): CalculationResults {
  const selectedAreas = project.impactAreas.filter((a) => a.selected);

  const metricResults = selectedAreas.flatMap((area) =>
    area.metrics.map((metric) => ({
      metricId: metric.id,
      areaId: area.id,
      metricName: metric.name,
      annualImpact: calcMetricAnnualImpact(metric),
      economicValue: calcMetricEconomicValue(metric),
      confidenceLevel: metric.confidenceLevel,
    }))
  );

  const totalAnnualBenefit = metricResults.reduce((sum, m) => sum + m.economicValue, 0);

  const areaValueMap = new Map<ImpactAreaId, number>();
  for (const m of metricResults) {
    areaValueMap.set(m.areaId, (areaValueMap.get(m.areaId) ?? 0) + m.economicValue);
  }

  const impactAreaResults = selectedAreas.map((area) => ({
    areaId: area.id,
    totalValue: areaValueMap.get(area.id) ?? 0,
    pctOfTotal: totalAnnualBenefit > 0 ? ((areaValueMap.get(area.id) ?? 0) / totalAnnualBenefit) * 100 : 0,
    metricCount: area.metrics.length,
  }));

  const { implementationCost, annualOperatingCost } = project.costInput;
  const totalCost = implementationCost + annualOperatingCost;
  const netValue = totalAnnualBenefit - totalCost;
  const roi = implementationCost > 0 ? (netValue / implementationCost) * 100 : null;
  const breakEvenMonths =
    totalAnnualBenefit > 0 ? implementationCost / (totalAnnualBenefit / 12) : null;

  const year1Value = totalAnnualBenefit - implementationCost - annualOperatingCost;
  const year3Value = totalAnnualBenefit * 3 - implementationCost - annualOperatingCost * 3;
  const year5Value = totalAnnualBenefit * 5 - implementationCost - annualOperatingCost * 5;

  const scenarios = Object.fromEntries(
    (Object.keys(SCENARIO_MULTIPLIERS) as ScenarioType[]).map((scenario) => {
      const mult = SCENARIO_MULTIPLIERS[scenario];
      const benefit = totalAnnualBenefit * mult;
      const net = benefit - totalCost;
      const scenRoi = implementationCost > 0 ? (net / implementationCost) * 100 : null;
      const scenY1 = benefit - implementationCost - annualOperatingCost;
      const scenY3 = benefit * 3 - implementationCost - annualOperatingCost * 3;
      const scenY5 = benefit * 5 - implementationCost - annualOperatingCost * 5;
      return [
        scenario,
        {
          totalBenefit: benefit,
          netValue: net,
          roi: scenRoi,
          year1: scenY1,
          year3: scenY3,
          year5: scenY5,
        } satisfies ScenarioResult,
      ];
    })
  ) as Record<ScenarioType, ScenarioResult>;

  return {
    totalAnnualBenefit,
    totalImplementationCost: implementationCost,
    totalAnnualOperatingCost: annualOperatingCost,
    netValue,
    roi,
    breakEvenMonths,
    year1Value,
    year3Value,
    year5Value,
    scenarios,
    metricResults,
    impactAreaResults,
  };
}
