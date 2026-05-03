import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { MetricEstimate, ConfidenceLevel, AssumptionSource } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { calcMetricAnnualImpact, calcMetricEconomicValue } from '@/utils/calculations';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Info } from 'lucide-react';

const metricSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Please provide a brief description'),
  unit: z.string().min(1, 'Unit is required'),
  baselineValue: z.coerce.number().min(0, 'Must be ≥ 0'),
  expectedChangePct: z.coerce.number().min(0).max(100),
  populationSize: z.coerce.number().min(1, 'Must be at least 1'),
  timeframeMonths: z.coerce.number().min(1).max(60),
  costPerUnit: z.coerce.number().min(0),
  confidenceLevel: z.enum(['low', 'medium', 'high']),
  assumptionSource: z.enum(['internal_data', 'research', 'expert_estimate', 'pilot_results']),
  notes: z.string(),
});

type MetricFormData = z.infer<typeof metricSchema>;

interface MetricFormProps {
  initial?: Partial<MetricEstimate>;
  onSave: (data: Omit<MetricEstimate, 'id'>) => void;
  onCancel: () => void;
}

const CONFIDENCE_COLORS: Record<ConfidenceLevel, 'success' | 'warning' | 'danger'> = {
  high: 'success',
  medium: 'warning',
  low: 'danger',
};

export function MetricForm({ initial, onSave, onCancel }: MetricFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MetricFormData>({
    resolver: zodResolver(metricSchema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      unit: initial?.unit ?? '',
      baselineValue: initial?.baselineValue ?? 0,
      expectedChangePct: initial?.expectedChangePct ?? 20,
      populationSize: initial?.populationSize ?? 100,
      timeframeMonths: initial?.timeframeMonths ?? 12,
      costPerUnit: initial?.costPerUnit ?? 0,
      confidenceLevel: initial?.confidenceLevel ?? 'medium',
      assumptionSource: initial?.assumptionSource ?? 'expert_estimate',
      notes: initial?.notes ?? '',
    },
  });

  const watched = watch();
  const [changePct, setChangePct] = useState(initial?.expectedChangePct ?? 20);

  const previewMetric = { ...watched, expectedChangePct: changePct, id: '' };
  const annualImpact = calcMetricAnnualImpact(previewMetric as MetricEstimate);
  const economicValue = calcMetricEconomicValue(previewMetric as MetricEstimate);

  function onSubmit(data: MetricFormData) {
    onSave({ ...data, expectedChangePct: changePct });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Metric Name *</Label>
          <Input id="name" {...register('name')} placeholder="e.g. Reduction in ER visits" className="mt-1" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Briefly describe what this metric measures and how the change is estimated"
            className="mt-1 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="unit">Unit of Measurement *</Label>
          <Input id="unit" {...register('unit')} placeholder="e.g. visits/year, patients, hours" className="mt-1" />
          {errors.unit && <p className="text-xs text-destructive mt-1">{errors.unit.message}</p>}
        </div>

        <div>
          <Label htmlFor="populationSize">Population Size *</Label>
          <Input
            id="populationSize"
            type="number"
            min={1}
            {...register('populationSize')}
            placeholder="Number of people affected"
            className="mt-1"
          />
          {errors.populationSize && <p className="text-xs text-destructive mt-1">{errors.populationSize.message}</p>}
        </div>

        <div>
          <Label htmlFor="baselineValue">
            Baseline Value (per person){' '}
            <span className="text-xs text-muted-foreground font-normal">Current annual rate</span>
          </Label>
          <Input
            id="baselineValue"
            type="number"
            step="any"
            min={0}
            {...register('baselineValue')}
            className="mt-1"
          />
          {errors.baselineValue && <p className="text-xs text-destructive mt-1">{errors.baselineValue.message}</p>}
        </div>

        <div>
          <Label htmlFor="timeframeMonths">Analysis Timeframe (months)</Label>
          <Input
            id="timeframeMonths"
            type="number"
            min={1}
            max={60}
            {...register('timeframeMonths')}
            className="mt-1"
          />
        </div>
      </div>

      {/* Expected change slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Expected Change (%)</Label>
          <span className="text-lg font-bold text-primary">{changePct}%</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[changePct]}
          onValueChange={([v]) => {
            setChangePct(v);
            setValue('expectedChangePct', v);
          }}
          className="mb-1"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0% (no change)</span>
          <span>100% (eliminate entirely)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="costPerUnit">
            Economic Value per Unit ($){' '}
            <span className="text-xs text-muted-foreground font-normal">Cost per avoided event/patient</span>
          </Label>
          <Input
            id="costPerUnit"
            type="number"
            min={0}
            step="any"
            {...register('costPerUnit')}
            placeholder="0"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Confidence Level</Label>
          <Select
            value={watched.confidenceLevel}
            onValueChange={(v) => setValue('confidenceLevel', v as ConfidenceLevel)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High — Based on strong evidence</SelectItem>
              <SelectItem value="medium">Medium — Reasonable estimate</SelectItem>
              <SelectItem value="low">Low — Speculative / early-stage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Source of Assumption</Label>
          <Select
            value={watched.assumptionSource}
            onValueChange={(v) => setValue('assumptionSource', v as AssumptionSource)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal_data">Internal Data</SelectItem>
              <SelectItem value="research">Published Research</SelectItem>
              <SelectItem value="expert_estimate">Expert Estimate</SelectItem>
              <SelectItem value="pilot_results">Pilot Results</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes / Rationale</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Explain the logic, data source, or reference behind this estimate"
          className="mt-1"
        />
      </div>

      {/* Live preview */}
      {economicValue > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
            <Info className="h-4 w-4" />
            Estimated Impact Preview
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Annual Impact</div>
              <div className="font-bold text-foreground">{formatNumber(annualImpact, 1)}</div>
              <div className="text-xs text-muted-foreground">{watched.unit}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Economic Value</div>
              <div className="font-bold text-foreground">{formatCurrency(economicValue, true)}</div>
              <div className="text-xs text-muted-foreground">per year</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Conservative</div>
              <div className="font-bold text-foreground">{formatCurrency(economicValue * 0.6, true)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Optimistic</div>
              <div className="font-bold text-foreground">{formatCurrency(economicValue * 1.4, true)}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence:</span>
            <Badge variant={CONFIDENCE_COLORS[watched.confidenceLevel as ConfidenceLevel]}>
              {watched.confidenceLevel.charAt(0).toUpperCase() + watched.confidenceLevel.slice(1)}
            </Badge>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">Save Metric</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
