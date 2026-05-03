import { useState } from 'react';
import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import type { ImpactArea, MetricEstimate } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricForm } from './MetricForm';
import { calcMetricEconomicValue } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricBuilderProps {
  impactAreas: ImpactArea[];
  onAddMetric: (areaId: string, metric: Omit<MetricEstimate, 'id'>) => void;
  onUpdateMetric: (areaId: string, metricId: string, data: Partial<MetricEstimate>) => void;
  onDeleteMetric: (areaId: string, metricId: string) => void;
}

type EditState =
  | { type: 'none' }
  | { type: 'new'; areaId: string; template?: Omit<MetricEstimate, 'id'> }
  | { type: 'edit'; areaId: string; metric: MetricEstimate };

const CONFIDENCE_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  high: 'success',
  medium: 'warning',
  low: 'danger',
};

export function MetricBuilder({ impactAreas, onAddMetric, onUpdateMetric, onDeleteMetric }: MetricBuilderProps) {
  const selectedAreas = impactAreas.filter((a) => a.selected);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(
    new Set(selectedAreas.map((a) => a.id))
  );
  const [editState, setEditState] = useState<EditState>({ type: 'none' });

  function toggleArea(id: string) {
    setExpandedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (selectedAreas.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-medium">No impact areas selected yet.</p>
        <p className="text-sm mt-1">Go back to select at least one impact area to start adding metrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedAreas.map((area) => {
        const template = IMPACT_AREA_TEMPLATES.find((t) => t.id === area.id)!;
        const expanded = expandedAreas.has(area.id);
        const areaTotal = area.metrics.reduce((s, m) => s + calcMetricEconomicValue(m), 0);

        return (
          <div key={area.id} className="border rounded-lg overflow-hidden">
            {/* Area header */}
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors text-left"
              onClick={() => toggleArea(area.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{template.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{template.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {area.metrics.length} metric{area.metrics.length !== 1 ? 's' : ''}
                    {areaTotal > 0 && ` · ${formatCurrency(areaTotal, true)}/yr estimated`}
                  </div>
                </div>
              </div>
              {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {expanded && (
              <div className="p-4 space-y-3">
                {/* Existing metrics */}
                {area.metrics.map((metric) => (
                  <div key={metric.id}>
                    {editState.type === 'edit' && editState.metric.id === metric.id ? (
                      <div className="border rounded-lg p-4 bg-accent/20">
                        <MetricForm
                          initial={metric}
                          onSave={(data) => {
                            onUpdateMetric(area.id, metric.id, data);
                            setEditState({ type: 'none' });
                          }}
                          onCancel={() => setEditState({ type: 'none' })}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border rounded-lg p-3 bg-white hover:bg-muted/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{metric.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {metric.expectedChangePct}% reduction · {metric.populationSize.toLocaleString()} people ·{' '}
                            <span className="font-medium text-foreground">{formatCurrency(calcMetricEconomicValue(metric), true)}/yr</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3 shrink-0">
                          <Badge variant={CONFIDENCE_VARIANT[metric.confidenceLevel]} className="hidden sm:inline-flex">
                            {metric.confidenceLevel}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setEditState({ type: 'edit', areaId: area.id, metric })}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => onDeleteMetric(area.id, metric.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* New metric form */}
                {editState.type === 'new' && editState.areaId === area.id && (
                  <div className="border rounded-lg p-4 bg-accent/20">
                    <MetricForm
                      initial={editState.template}
                      onSave={(data) => {
                        onAddMetric(area.id, data);
                        setEditState({ type: 'none' });
                      }}
                      onCancel={() => setEditState({ type: 'none' })}
                    />
                  </div>
                )}

                {/* Suggested metrics */}
                {editState.type === 'none' && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Quick add suggested metrics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.suggestedMetrics
                        .filter((sm) => !area.metrics.some((m) => m.name === sm.name))
                        .slice(0, 4)
                        .map((sm, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setEditState({ type: 'new', areaId: area.id, template: sm })
                            }
                            className="flex items-center gap-1.5 text-xs border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 rounded-full px-3 py-1 transition-colors"
                          >
                            <Zap className="h-3 w-3" />
                            {sm.name}
                          </button>
                        ))}
                      <button
                        type="button"
                        onClick={() => setEditState({ type: 'new', areaId: area.id })}
                        className={cn(
                          'flex items-center gap-1.5 text-xs border rounded-full px-3 py-1 transition-colors',
                          'border-muted-foreground/30 text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <Plus className="h-3 w-3" />
                        Custom metric
                      </button>
                    </div>
                  </div>
                )}

                {editState.type !== 'new' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() => setEditState({ type: 'new', areaId: area.id })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Custom Metric
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
