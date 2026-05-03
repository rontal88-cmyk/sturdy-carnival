import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AssumptionsTable } from '@/components/dashboard/AssumptionsTable';
import { ValueBreakdownChart } from '@/components/charts/ValueBreakdownChart';
import { ScenarioBarChart } from '@/components/charts/ScenarioBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { MetricsBarChart } from '@/components/charts/MetricsBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateResults } from '@/utils/calculations';
import { formatCurrency, formatMonths } from '@/utils/formatters';
import { STAKEHOLDER_CONFIG } from '@/data/stakeholderConfig';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FileText, TrendingUp, Activity } from 'lucide-react';

export function ResultsDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const projects = useProjectStore((s) => s.projects);
  const project = projects.find((p) => p.id === id);
  const [activeStakeholder, setActiveStakeholder] = useState<string>('all');

  if (!project) return <Navigate to="/projects" replace />;

  const results = calculateResults(project);
  const hasData = results.totalAnnualBenefit > 0;

  const activeConfig = activeStakeholder !== 'all'
    ? STAKEHOLDER_CONFIG.find((s) => s.id === activeStakeholder)
    : null;

  const filteredAreaResults = activeConfig && activeConfig.emphasizedAreaIds !== 'all'
    ? results.impactAreaResults.filter((r) =>
        (activeConfig.emphasizedAreaIds as string[]).includes(r.areaId)
      )
    : results.impactAreaResults;

  return (
    <TooltipProvider>
      <AppLayout>
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Results Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{project.name}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/projects/${id}/scenarios`}>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-1" /> Scenarios
                </Button>
              </Link>
              <Link to={`/projects/${id}/report`}>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-1" /> Report
                </Button>
              </Link>
            </div>
          </div>

          {/* Stakeholder filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground font-medium">View as:</span>
            <button
              onClick={() => setActiveStakeholder('all')}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${activeStakeholder === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
            >
              All Impact Areas
            </button>
            {STAKEHOLDER_CONFIG.filter((s) => project.mainStakeholders.includes(s.id)).map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStakeholder(s.id)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${activeStakeholder === s.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {activeConfig && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
              <strong>{activeConfig.label} view:</strong> {activeConfig.narrativeContext}
            </div>
          )}

          {!hasData ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No metrics with economic values yet</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                  Add metrics with a cost-per-unit value in the Impact Builder to see financial calculations.
                </p>
                <Link to={`/projects/${id}/impact`}>
                  <Button>Go to Impact Builder</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <KPICard
                  label="Annual Benefit"
                  value={formatCurrency(results.totalAnnualBenefit, true)}
                  description="Total estimated annual economic benefit across all metrics"
                  trend="positive"
                  className="col-span-1"
                />
                <KPICard
                  label="Implementation Cost"
                  value={formatCurrency(results.totalImplementationCost, true)}
                  description="One-time investment to launch the project"
                  trend="negative"
                />
                <KPICard
                  label="Net Value (Yr 1)"
                  value={formatCurrency(results.year1Value, true)}
                  description="Annual benefit minus all Year 1 costs"
                  trend={results.year1Value > 0 ? 'positive' : 'negative'}
                />
                <KPICard
                  label="5-Year Net Value"
                  value={formatCurrency(results.year5Value, true)}
                  description="Cumulative net value over 5 years"
                  trend={results.year5Value > 0 ? 'positive' : 'negative'}
                />
                <KPICard
                  label="ROI"
                  value={results.roi != null ? `${Math.round(results.roi)}%` : '—'}
                  description="Return on investment: net value divided by implementation cost"
                  trend={results.roi != null && results.roi > 0 ? 'positive' : 'neutral'}
                />
                <KPICard
                  label="Break-Even"
                  value={results.breakEvenMonths != null ? formatMonths(results.breakEvenMonths) : '—'}
                  description="Time until cumulative benefits exceed implementation cost"
                  trend="neutral"
                />
              </div>

              {/* Scenario summary strip */}
              <div className="grid grid-cols-3 gap-3">
                {(['conservative', 'realistic', 'optimistic'] as const).map((s) => (
                  <Card key={s} className={`border-2 ${s === 'realistic' ? 'border-primary' : 'border-border'}`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 capitalize">{s}</div>
                      <div className="text-xl font-bold">{formatCurrency(results.scenarios[s].totalBenefit, true)}</div>
                      <div className={`text-sm mt-1 ${results.scenarios[s].netValue > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        Net: {formatCurrency(results.scenarios[s].netValue, true)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {s === 'conservative' ? '60% of estimate' : s === 'optimistic' ? '140% of estimate' : 'Base estimate'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <Tabs defaultValue="breakdown">
                <TabsList className="mb-4">
                  <TabsTrigger value="breakdown">Value Breakdown</TabsTrigger>
                  <TabsTrigger value="metrics">By Metric</TabsTrigger>
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
                </TabsList>

                <TabsContent value="breakdown">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Value by Impact Area</CardTitle></CardHeader>
                    <CardContent>
                      <ValueBreakdownChart impactAreaResults={filteredAreaResults} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metrics">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Annual Value by Metric (color = confidence)</CardTitle></CardHeader>
                    <CardContent>
                      <MetricsBarChart metricResults={results.metricResults} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="scenarios">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Scenario Comparison</CardTitle></CardHeader>
                    <CardContent>
                      <ScenarioBarChart results={results} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Cumulative Net Value Over Time</CardTitle></CardHeader>
                    <CardContent>
                      <TimelineChart results={results} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assumptions">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Assumptions Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AssumptionsTable project={project} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </AppLayout>
    </TooltipProvider>
  );
}
