import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ScenarioBarChart } from '@/components/charts/ScenarioBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { calculateResults } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import type { CalculationResults, ScenarioType } from '@/types';

function buildCustomResults(base: CalculationResults, conservMult: number, optimMult: number): CalculationResults {
  const makeScenario = (mult: number) => {
    const benefit = base.totalAnnualBenefit * mult;
    const totalCost = base.totalImplementationCost + base.totalAnnualOperatingCost;
    const net = benefit - totalCost;
    const roi = base.totalImplementationCost > 0 ? (net / base.totalImplementationCost) * 100 : null;
    return {
      totalBenefit: benefit,
      netValue: net,
      roi,
      year1: benefit - base.totalImplementationCost - base.totalAnnualOperatingCost,
      year3: benefit * 3 - base.totalImplementationCost - base.totalAnnualOperatingCost * 3,
      year5: benefit * 5 - base.totalImplementationCost - base.totalAnnualOperatingCost * 5,
    };
  };
  return {
    ...base,
    scenarios: {
      conservative: makeScenario(conservMult),
      realistic: makeScenario(1.0),
      optimistic: makeScenario(optimMult),
    },
  };
}

export function ScenarioAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const projects = useProjectStore((s) => s.projects);
  const project = projects.find((p) => p.id === id);
  const [conservMult, setConservMult] = useState(60);
  const [optimMult, setOptimMult] = useState(140);

  if (!project) return <Navigate to="/projects" replace />;

  const baseResults = calculateResults(project);
  const results = buildCustomResults(baseResults, conservMult / 100, optimMult / 100);

  const SCENARIO_LABELS: Record<ScenarioType, { color: string; desc: string }> = {
    conservative: { color: 'text-amber-600', desc: `${conservMult}% of base estimate — worst-case assumptions` },
    realistic: { color: 'text-teal-700', desc: '100% — base estimate as modelled' },
    optimistic: { color: 'text-indigo-600', desc: `${optimMult}% of base estimate — best-case assumptions` },
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Scenario Analysis</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{project.name}</p>
        </div>

        {/* Multiplier controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scenario Multipliers</CardTitle>
            <CardDescription>
              Adjust the multipliers to explore how your estimates hold up under different assumptions.
              The realistic scenario always uses 100% of your base estimate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-amber-700">Conservative Scenario</label>
                <span className="text-sm font-bold text-amber-700">{conservMult}%</span>
              </div>
              <Slider min={20} max={90} step={5} value={[conservMult]} onValueChange={([v]) => setConservMult(v)} />
              <p className="text-xs text-muted-foreground mt-1">How much of your realistic estimate do you expect in the worst case?</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-indigo-700">Optimistic Scenario</label>
                <span className="text-sm font-bold text-indigo-700">{optimMult}%</span>
              </div>
              <Slider min={110} max={200} step={5} value={[optimMult]} onValueChange={([v]) => setOptimMult(v)} />
              <p className="text-xs text-muted-foreground mt-1">How much of your realistic estimate do you expect in the best case?</p>
            </div>
          </CardContent>
        </Card>

        {/* Scenario cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['conservative', 'realistic', 'optimistic'] as ScenarioType[]).map((scenario) => {
            const s = results.scenarios[scenario];
            const { color, desc } = SCENARIO_LABELS[scenario];
            return (
              <Card key={scenario} className={scenario === 'realistic' ? 'border-2 border-primary' : ''}>
                <CardContent className="p-5">
                  <div className="capitalize font-bold text-sm text-muted-foreground mb-3">{scenario}</div>
                  <div className="text-xs text-muted-foreground mb-4">{desc}</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Annual Benefit</div>
                      <div className={`text-xl font-bold ${color}`}>{formatCurrency(s.totalBenefit)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Net Value (Year 1)</div>
                      <div className={`text-lg font-semibold ${s.year1 > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {formatCurrency(s.year1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">3-Year Net</div>
                        <div className="font-semibold text-sm">{formatCurrency(s.year3, true)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">5-Year Net</div>
                        <div className="font-semibold text-sm">{formatCurrency(s.year5, true)}</div>
                      </div>
                    </div>
                    {s.roi != null && (
                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground">ROI</div>
                        <div className="font-bold">{Math.round(s.roi)}%</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Scenario Comparison</CardTitle></CardHeader>
            <CardContent><ScenarioBarChart results={results} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Cumulative Net Value Over Time</CardTitle></CardHeader>
            <CardContent><TimelineChart results={results} /></CardContent>
          </Card>
        </div>

        {/* Interpretation note */}
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Note on uncertainty:</strong> All figures are estimates, not financial guarantees.
          The range between conservative and optimistic scenarios reflects the inherent uncertainty in projecting healthcare
          impact. Lower confidence metrics (shown in red in the assumptions table) should be treated with additional caution.
          We recommend presenting the realistic scenario as your primary estimate, with the conservative scenario as the
          minimum credible expectation.
        </div>
      </div>
    </AppLayout>
  );
}
