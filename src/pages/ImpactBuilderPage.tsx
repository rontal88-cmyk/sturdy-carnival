import { useParams, Navigate, Link } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImpactAreaGrid } from '@/components/impact/ImpactAreaGrid';
import { MetricBuilder } from '@/components/impact/MetricBuilder';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ImpactAreaId, MetricEstimate } from '@/types';
import { ArrowRight } from 'lucide-react';

export function ImpactBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, toggleImpactArea, addMetric, updateMetric, deleteMetric } = useProjectStore();
  const project = projects.find((p) => p.id === id);

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Impact Builder</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Select the impact areas relevant to your project, then add and configure metrics for each area.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Impact Areas</CardTitle>
            <CardDescription>Click to select or deselect. Each selected area can have one or more metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImpactAreaGrid
              impactAreas={project.impactAreas}
              onToggle={(areaId, selected) => toggleImpactArea(id!, areaId as ImpactAreaId, selected)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
            <CardDescription>
              For each selected area, add metrics with estimates. Use suggested metrics as starting points — every value is editable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricBuilder
              impactAreas={project.impactAreas}
              onAddMetric={(areaId, metric) =>
                addMetric(id!, areaId as ImpactAreaId, metric as Omit<MetricEstimate, 'id'>)
              }
              onUpdateMetric={(areaId, metricId, data) =>
                updateMetric(id!, areaId as ImpactAreaId, metricId, data)
              }
              onDeleteMetric={(areaId, metricId) =>
                deleteMetric(id!, areaId as ImpactAreaId, metricId)
              }
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Link to={`/projects/${id}/results`}>
            <Button>
              View Results Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
