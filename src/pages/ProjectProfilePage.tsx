import { Link, useParams, Navigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { calculateResults } from '@/utils/calculations';
import { formatCurrency, formatDate, formatMonths } from '@/utils/formatters';
import { STAKEHOLDER_CONFIG } from '@/data/stakeholderConfig';
import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import { BarChart3, TrendingUp, FileText, Activity, ArrowRight, Edit } from 'lucide-react';

export function ProjectProfilePage() {
  const { id } = useParams<{ id: string }>();
  const projects = useProjectStore((s) => s.projects);
  const project = projects.find((p) => p.id === id);

  if (!project) return <Navigate to="/projects" replace />;

  const results = calculateResults(project);
  const selectedAreas = project.impactAreas.filter((a) => a.selected);
  const totalMetrics = selectedAreas.reduce((s, a) => s + a.metrics.length, 0);
  const stakeholders = STAKEHOLDER_CONFIG.filter((s) => project.mainStakeholders.includes(s.id));

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {project.isDemo && <Badge variant="info">Demo</Badge>}
            </div>
            <p className="text-muted-foreground text-sm">
              {project.healthcareSetting} · Updated {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Impact Builder', href: `/projects/${id}/impact`, icon: <Activity className="h-5 w-5" />, desc: 'Edit metrics' },
            { label: 'Results', href: `/projects/${id}/results`, icon: <BarChart3 className="h-5 w-5" />, desc: 'Dashboard & KPIs' },
            { label: 'Scenarios', href: `/projects/${id}/scenarios`, icon: <TrendingUp className="h-5 w-5" />, desc: 'Conservative–Optimistic' },
            { label: 'Report', href: `/projects/${id}/report`, icon: <FileText className="h-5 w-5" />, desc: 'Stakeholder view' },
          ].map((nav) => (
            <Link key={nav.href} to={nav.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-primary/40">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="text-primary">{nav.icon}</div>
                  <div className="font-semibold text-sm">{nav.label}</div>
                  <div className="text-xs text-muted-foreground">{nav.desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Annual Benefit</div>
            <div className="text-2xl font-bold text-teal-700">{results.totalAnnualBenefit > 0 ? formatCurrency(results.totalAnnualBenefit) : '—'}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Net Value</div>
            <div className={`text-2xl font-bold ${results.netValue > 0 ? 'text-green-600' : 'text-foreground'}`}>
              {results.totalAnnualBenefit > 0 ? formatCurrency(results.netValue) : '—'}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ROI</div>
            <div className="text-2xl font-bold">{results.roi != null ? `${Math.round(results.roi)}%` : '—'}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Break-Even</div>
            <div className="text-2xl font-bold">{results.breakEvenMonths != null ? formatMonths(results.breakEvenMonths) : '—'}</div>
          </Card>
        </div>

        {/* Project details + areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Target Population</div>
                <div>{project.targetPopulation}</div>
              </div>
              <div>
                <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Problem</div>
                <div className="text-muted-foreground">{project.problemDescription}</div>
              </div>
              <div>
                <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Intervention</div>
                <div className="text-muted-foreground">{project.proposedIntervention}</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Impact Coverage</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {IMPACT_AREA_TEMPLATES.map((t) => {
                    const area = project.impactAreas.find((a) => a.id === t.id);
                    const active = area?.selected;
                    return (
                      <div key={t.id} className={`flex items-center gap-2 text-xs rounded p-1.5 ${active ? 'bg-primary/5 text-foreground' : 'text-muted-foreground/50'}`}>
                        <span>{t.icon}</span>
                        <span className={active ? 'font-medium' : ''}>{t.label}</span>
                        {active && area && area.metrics.length > 0 && (
                          <span className="ml-auto text-primary font-semibold">{area.metrics.length}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{selectedAreas.length} areas · {totalMetrics} metrics</span>
                  <Link to={`/projects/${id}/impact`}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {stakeholders.length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Stakeholders</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stakeholders.map((s) => (
                      <Link key={s.id} to={`/projects/${id}/report/${s.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                          {s.icon} {s.label}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Link to={`/projects/${id}/results`}>
            <Button>
              View Full Results Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
