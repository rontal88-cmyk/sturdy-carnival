import { useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useProjectStore } from '@/store/projectStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { AssumptionsTable } from '@/components/dashboard/AssumptionsTable';
import { ValueBreakdownChart } from '@/components/charts/ValueBreakdownChart';
import { ScenarioBarChart } from '@/components/charts/ScenarioBarChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateResults } from '@/utils/calculations';
import { formatCurrency, formatDate, formatMonths } from '@/utils/formatters';
import { STAKEHOLDER_CONFIG } from '@/data/stakeholderConfig';
import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import type { StakeholderType } from '@/types';
import { Printer, Users } from 'lucide-react';

interface ReportContentProps {
  project: ReturnType<typeof useProjectStore.getState>['projects'][0];
  activeStakeholder: StakeholderConfig | null;
  results: ReturnType<typeof calculateResults>;
}

interface StakeholderConfig {
  id: StakeholderType;
  label: string;
  icon: string;
  narrativeContext: string;
  emphasizedAreaIds: string[] | 'all';
  keyValueDimensions: string[];
  description: string;
}

function ReportContent({ project, activeStakeholder, results }: ReportContentProps) {
  const selectedAreas = project.impactAreas.filter((a) => a.selected && a.metrics.length > 0);
  const filteredAreaResults = activeStakeholder && activeStakeholder.emphasizedAreaIds !== 'all'
    ? results.impactAreaResults.filter((r) =>
        (activeStakeholder.emphasizedAreaIds as string[]).includes(r.areaId)
      )
    : results.impactAreaResults;

  const totalMetrics = selectedAreas.reduce((s, a) => s + a.metrics.length, 0);

  return (
    <div className="space-y-8">
      {/* Report header */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-teal-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">HealthImpact — Impact Evaluation Report</span>
        </div>
        <h1 className="text-2xl font-bold mt-3">{project.name}</h1>
        <div className="text-muted-foreground text-sm mt-1">
          {project.healthcareSetting} · Report generated {formatDate(new Date().toISOString())}
        </div>
        {activeStakeholder && (
          <div className="mt-2">
            <Badge variant="info">{activeStakeholder.icon} {activeStakeholder.label} View</Badge>
          </div>
        )}
      </div>

      {/* Executive summary */}
      <div>
        <h2 className="text-lg font-bold mb-3">Executive Summary</h2>
        <div className="rounded-lg bg-teal-50 border border-teal-200 p-5 space-y-3 text-sm">
          <p>
            <strong>{project.name}</strong> is a healthcare innovation project targeting{' '}
            <strong>{project.targetPopulation}</strong> in a <strong>{project.healthcareSetting}</strong> setting.
          </p>
          <p>{project.problemDescription}</p>
          <p>
            <strong>Proposed approach:</strong> {project.proposedIntervention}
          </p>
          <p>
            <strong>Intended outcomes:</strong> {project.intendedOutcomes}
          </p>
          {activeStakeholder && (
            <p className="border-t pt-3 mt-2 text-muted-foreground italic">{activeStakeholder.narrativeContext}</p>
          )}
        </div>
      </div>

      {/* Key numbers */}
      {results.totalAnnualBenefit > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Key Impact Numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Estimated Annual Benefit', value: formatCurrency(results.totalAnnualBenefit), sub: 'Realistic scenario' },
              { label: 'Conservative Estimate', value: formatCurrency(results.scenarios.conservative.totalBenefit), sub: '60% of base' },
              { label: 'Optimistic Estimate', value: formatCurrency(results.scenarios.optimistic.totalBenefit), sub: '140% of base' },
              { label: 'Net Value (Year 1)', value: formatCurrency(results.year1Value), sub: 'After all Year 1 costs' },
              { label: '5-Year Cumulative Net', value: formatCurrency(results.year5Value), sub: 'After all costs' },
              { label: 'Break-Even', value: results.breakEvenMonths != null ? formatMonths(results.breakEvenMonths) : 'N/A', sub: 'Time to recover investment' },
            ].map((item) => (
              <div key={item.label} className="border rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                <div className="text-xl font-bold text-teal-700">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact coverage */}
      <div>
        <h2 className="text-lg font-bold mb-3">Impact Coverage</h2>
        <p className="text-sm text-muted-foreground mb-3">
          This project addresses <strong>{selectedAreas.length} impact dimensions</strong> with <strong>{totalMetrics} estimated metrics</strong>.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {selectedAreas.map((area) => {
            const template = IMPACT_AREA_TEMPLATES.find((t) => t.id === area.id)!;
            return (
              <div key={area.id} className="flex items-center gap-2 rounded border p-2 text-sm">
                <span>{template.icon}</span>
                <span className="font-medium">{template.label}</span>
                <span className="ml-auto text-muted-foreground text-xs">{area.metrics.length} metrics</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value breakdown chart */}
      {results.totalAnnualBenefit > 0 && filteredAreaResults.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Value Breakdown by Impact Area</h2>
          <ValueBreakdownChart impactAreaResults={filteredAreaResults} />
        </div>
      )}

      {/* Scenario comparison */}
      {results.totalAnnualBenefit > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Scenario Comparison</h2>
          <ScenarioBarChart results={results} />
          <p className="text-xs text-muted-foreground mt-2">
            Conservative: 60% · Realistic: 100% · Optimistic: 140% of base estimate
          </p>
        </div>
      )}

      {/* Assumptions table */}
      <div>
        <h2 className="text-lg font-bold mb-3">Assumptions & Confidence Levels</h2>
        <p className="text-sm text-muted-foreground mb-3">
          All estimates are based on the assumptions below. Every assumption is transparent and editable.
          Confidence levels reflect the quality of underlying evidence: High (strong evidence), Medium (reasonable estimate), Low (speculative).
        </p>
        <AssumptionsTable project={project} />
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-muted-foreground">
        <p>
          <strong>Disclaimer:</strong> All figures in this report are estimates based on modelled assumptions. They represent
          expected ranges of impact, not guaranteed financial outcomes. Every assumption should be reviewed and validated
          against local data before use in formal business cases or funding applications.
        </p>
        <p className="mt-1">Generated by HealthImpact · {formatDate(new Date().toISOString())}</p>
      </div>
    </div>
  );
}

export function ExportReportPage() {
  const { id, stakeholder } = useParams<{ id: string; stakeholder?: string }>();
  const projects = useProjectStore((s) => s.projects);
  const project = projects.find((p) => p.id === id);
  const printRef = useRef<HTMLDivElement>(null);

  const [activeStakeholderId, setActiveStakeholderId] = useState<string>(
    stakeholder ?? 'all'
  );

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `HealthImpact Report — ${project?.name ?? 'Project'}`,
  });

  if (!project) return <Navigate to="/projects" replace />;

  const results = calculateResults(project);
  const activeStakeholder = activeStakeholderId !== 'all'
    ? (STAKEHOLDER_CONFIG.find((s) => s.id === activeStakeholderId) as StakeholderConfig | undefined) ?? null
    : null;

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold">Stakeholder Report</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{project.name}</p>
          </div>
          <Button onClick={() => handlePrint()}>
            <Printer className="h-4 w-4 mr-2" />
            Print / Export PDF
          </Button>
        </div>

        {/* Stakeholder selector */}
        <div className="no-print">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Select stakeholder view:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveStakeholderId('all')}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${activeStakeholderId === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
            >
              Full Report
            </button>
            {STAKEHOLDER_CONFIG.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStakeholderId(s.id)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${activeStakeholderId === s.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report content (also the print target) */}
        <div ref={printRef} className="bg-white rounded-lg border p-8">
          <ReportContent
            project={project}
            activeStakeholder={activeStakeholder}
            results={results}
          />
        </div>
      </div>
    </AppLayout>
  );
}
