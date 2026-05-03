import { Link } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateResults } from '@/utils/calculations';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, ArrowRight, Trash2, Activity } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export function ProjectsListPage() {
  const { projects, deleteProject } = useProjectStore();

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Delete project "${name}"? This cannot be undone.`)) {
      deleteProject(id);
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {projects.length} project evaluation{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Evaluation
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No projects yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Create your first healthcare project evaluation to get started.
            </p>
            <Link to="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => {
              const results = calculateResults(project);
              const selectedAreas = project.impactAreas.filter((a) => a.selected);
              const totalMetrics = selectedAreas.reduce((s, a) => s + a.metrics.length, 0);

              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base truncate">{project.name}</CardTitle>
                          {project.isDemo && (
                            <Badge variant="info" className="shrink-0 text-xs">Demo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.healthcareSetting} · {project.targetPopulation}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(project.id, project.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Link to={`/projects/${project.id}`}>
                          <Button size="sm">
                            Open
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Annual Benefit</div>
                        <div className="font-semibold text-teal-700">
                          {results.totalAnnualBenefit > 0
                            ? formatCurrency(results.totalAnnualBenefit, true)
                            : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Net Value</div>
                        <div className={`font-semibold ${results.netValue > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {results.totalAnnualBenefit > 0
                            ? formatCurrency(results.netValue, true)
                            : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Impact Areas</div>
                        <div className="font-semibold">{selectedAreas.length} / 10</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Metrics</div>
                        <div className="font-semibold">{totalMetrics}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-1">
                        {project.impactAreas
                          .filter((a) => a.selected)
                          .slice(0, 5)
                          .map((a) => {
                            const ICONS: Record<string, string> = {
                              clinical_outcomes: '🩺', access_to_care: '🚪',
                              patient_experience: '😊', health_equity: '⚖️',
                              operational_efficiency: '⚙️', staff_workload: '👩‍⚕️',
                              financial_value: '💰', quality_safety: '🛡️',
                              continuity_of_care: '🔗', system_level_impact: '🌐',
                            };
                            return (
                              <span key={a.id} className="text-sm" title={a.id.replace(/_/g, ' ')}>
                                {ICONS[a.id]}
                              </span>
                            );
                          })}
                        {selectedAreas.length > 5 && (
                          <span className="text-xs text-muted-foreground">+{selectedAreas.length - 5}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        Updated {formatDate(project.updatedAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
