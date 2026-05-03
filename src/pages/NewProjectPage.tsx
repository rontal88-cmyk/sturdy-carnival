import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { StepProgress } from '@/components/layout/StepProgress';
import { ImpactAreaGrid } from '@/components/impact/ImpactAreaGrid';
import { MetricBuilder } from '@/components/impact/MetricBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProjectStore } from '@/store/projectStore';
import { STAKEHOLDER_CONFIG } from '@/data/stakeholderConfig';
import type { StakeholderType, MetricEstimate, ImpactAreaId } from '@/types';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Basics' },
  { label: 'Stakeholders' },
  { label: 'Impact Areas' },
  { label: 'Metrics' },
  { label: 'Costs' },
];

const basicSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  targetPopulation: z.string().min(5, 'Please describe the target population'),
  healthcareSetting: z.string().min(3, 'Please enter the healthcare setting'),
  problemDescription: z.string().min(10, 'Please describe the problem'),
  painPoints: z.string().min(5, 'Please list the key pain points'),
  proposedIntervention: z.string().min(10, 'Please describe the proposed intervention'),
  intendedOutcomes: z.string().min(5, 'Please describe intended outcomes'),
});

type BasicFormData = z.infer<typeof basicSchema>;

function suggestImpactAreas(problem: string, painPoints: string): ImpactAreaId[] {
  const text = `${problem} ${painPoints}`.toLowerCase();
  const suggestions: ImpactAreaId[] = [];
  if (/emergency|er visit|hospitali|readmit/.test(text)) suggestions.push('operational_efficiency', 'financial_value');
  if (/clinic|diagnos|treatment|patient outcome|disease|chronic/.test(text)) suggestions.push('clinical_outcomes');
  if (/access|wait|rural|remote|underserved|barrier/.test(text)) suggestions.push('access_to_care');
  if (/equity|disparit|minority|low.income|marginali/.test(text)) suggestions.push('health_equity');
  if (/staff|nurse|physician|workload|burnout|admin/.test(text)) suggestions.push('staff_workload');
  if (/satisfaction|patient experience|quality of life/.test(text)) suggestions.push('patient_experience');
  if (/cost|saving|financ|budget|revenue/.test(text)) suggestions.push('financial_value');
  if (/safety|error|adverse|quality|guideline/.test(text)) suggestions.push('quality_safety');
  if (/continuity|coordination|follow.up|transition/.test(text)) suggestions.push('continuity_of_care');
  if (/system|scale|policy|population/.test(text)) suggestions.push('system_level_impact');
  return [...new Set(suggestions)].slice(0, 5);
}

export function NewProjectPage() {
  const navigate = useNavigate();
  const { createProject, updateProject, toggleImpactArea, addMetric, updateMetric, deleteMetric, updateCosts, projects } = useProjectStore();

  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedStakeholders, setSelectedStakeholders] = useState<StakeholderType[]>([]);
  const [suggestedAreas, setSuggestedAreas] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicFormData>({ resolver: zodResolver(basicSchema) });

  const currentProject = projectId ? projects.find((p) => p.id === projectId) : null;

  // --- Step 1: Basics ---
  function onBasicsSubmit(data: BasicFormData) {
    const id = createProject({ ...data, mainStakeholders: [] });
    setProjectId(id);
    const suggested = suggestImpactAreas(data.problemDescription, data.painPoints);
    setSuggestedAreas(suggested);
    setStep(2);
  }

  // --- Step 2: Stakeholders ---
  function toggleStakeholder(id: StakeholderType) {
    setSelectedStakeholders((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function onStakeholdersNext() {
    if (!projectId) return;
    updateProject(projectId, { mainStakeholders: selectedStakeholders });
    // Auto-select suggested areas
    if (currentProject) {
      suggestedAreas.forEach((areaId) => {
        toggleImpactArea(projectId, areaId as ImpactAreaId, true);
      });
    }
    setStep(3);
  }

  // --- Step 5: Costs ---
  const [costs, setCosts] = useState({
    implementationCost: '',
    annualOperatingCost: '',
    staffingCost: '',
    technologyCost: '',
    trainingCost: '',
    notes: '',
  });

  function onCostsFinish() {
    if (!projectId) return;
    updateCosts(projectId, {
      implementationCost: parseFloat(costs.implementationCost) || 0,
      annualOperatingCost: parseFloat(costs.annualOperatingCost) || 0,
      staffingCost: parseFloat(costs.staffingCost) || 0,
      technologyCost: parseFloat(costs.technologyCost) || 0,
      trainingCost: parseFloat(costs.trainingCost) || 0,
      notes: costs.notes,
    });
    navigate(`/projects/${projectId}/results`);
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">New Project Evaluation</h1>
          <StepProgress steps={STEPS} currentStep={step} />
        </div>

        {/* Step 1: Basics */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Basics</CardTitle>
              <CardDescription>Tell us about your healthcare project so we can help you identify the right impact areas.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onBasicsSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input id="name" {...register('name')} placeholder="e.g. Telehealth Triage Program" className="mt-1" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetPopulation">Target Population *</Label>
                    <Input id="targetPopulation" {...register('targetPopulation')} placeholder="e.g. Elderly diabetic patients" className="mt-1" />
                    {errors.targetPopulation && <p className="text-xs text-destructive mt-1">{errors.targetPopulation.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="healthcareSetting">Healthcare Setting *</Label>
                    <Input id="healthcareSetting" {...register('healthcareSetting')} placeholder="e.g. Primary care clinic" className="mt-1" />
                    {errors.healthcareSetting && <p className="text-xs text-destructive mt-1">{errors.healthcareSetting.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="problemDescription">Problem Being Addressed *</Label>
                  <Textarea id="problemDescription" {...register('problemDescription')} placeholder="Describe the healthcare problem or gap this project addresses..." className="mt-1" />
                  {errors.problemDescription && <p className="text-xs text-destructive mt-1">{errors.problemDescription.message}</p>}
                </div>
                <div>
                  <Label htmlFor="painPoints">Current Pain Points *</Label>
                  <Textarea id="painPoints" {...register('painPoints')} placeholder="What are the main challenges, inefficiencies, or unmet needs?" className="mt-1" />
                  {errors.painPoints && <p className="text-xs text-destructive mt-1">{errors.painPoints.message}</p>}
                </div>
                <div>
                  <Label htmlFor="proposedIntervention">Proposed Service / Intervention *</Label>
                  <Textarea id="proposedIntervention" {...register('proposedIntervention')} placeholder="Describe your project, service, or program..." className="mt-1" />
                  {errors.proposedIntervention && <p className="text-xs text-destructive mt-1">{errors.proposedIntervention.message}</p>}
                </div>
                <div>
                  <Label htmlFor="intendedOutcomes">Intended Outcomes *</Label>
                  <Textarea id="intendedOutcomes" {...register('intendedOutcomes')} placeholder="What does success look like? What changes do you hope to achieve?" className="mt-1" />
                  {errors.intendedOutcomes && <p className="text-xs text-destructive mt-1">{errors.intendedOutcomes.message}</p>}
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit">
                    Next: Stakeholders
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Stakeholders */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Who Are Your Stakeholders?</CardTitle>
              <CardDescription>Select all groups you need to communicate impact to. Each will get a tailored view emphasizing what matters to them.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {STAKEHOLDER_CONFIG.map((s) => {
                  const selected = selectedStakeholders.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleStakeholder(s.id)}
                      className={cn(
                        'text-left rounded-lg border-2 p-4 transition-all',
                        selected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'border-border hover:border-primary/40 hover:bg-muted/40'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">{s.icon}</span>
                        {selected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="font-semibold text-sm">{s.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-tight">{s.description}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={onStakeholdersNext}>
                  Next: Impact Areas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Impact Areas */}
        {step === 3 && currentProject && (
          <Card>
            <CardHeader>
              <CardTitle>Select Impact Areas</CardTitle>
              <CardDescription>
                Choose the dimensions where your project creates value.
                {suggestedAreas.length > 0 && ' We\'ve pre-selected areas based on your project description — adjust as needed.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestedAreas.length > 0 && (
                <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
                  <strong>Suggested areas highlighted</strong> — based on your project description. You can select or deselect any area.
                </div>
              )}
              <ImpactAreaGrid
                impactAreas={currentProject.impactAreas}
                onToggle={(id, selected) => toggleImpactArea(projectId!, id as ImpactAreaId, selected)}
                suggestedIds={suggestedAreas}
              />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!currentProject.impactAreas.some((a) => a.selected)}
                >
                  Next: Add Metrics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Metrics */}
        {step === 4 && currentProject && (
          <Card>
            <CardHeader>
              <CardTitle>Build Your Impact Metrics</CardTitle>
              <CardDescription>
                For each selected impact area, add metrics with estimates. Use the suggested metrics as starting points — every value is editable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricBuilder
                impactAreas={currentProject.impactAreas}
                onAddMetric={(areaId, metric) => addMetric(projectId!, areaId as ImpactAreaId, metric as Omit<MetricEstimate, 'id'>)}
                onUpdateMetric={(areaId, metricId, data) => updateMetric(projectId!, areaId as ImpactAreaId, metricId, data)}
                onDeleteMetric={(areaId, metricId) => deleteMetric(projectId!, areaId as ImpactAreaId, metricId)}
              />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(5)}>
                  Next: Implementation Costs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Costs */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Implementation Costs</CardTitle>
              <CardDescription>
                Enter estimated costs to calculate net value, ROI, and break-even. Leave at 0 if not yet determined.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'implementationCost', label: 'Total Implementation Cost ($)', hint: 'One-time setup, development, procurement' },
                  { key: 'annualOperatingCost', label: 'Annual Operating Cost ($)', hint: 'Recurring costs per year after launch' },
                  { key: 'staffingCost', label: 'Staffing Cost ($)', hint: 'New FTEs or time allocation required' },
                  { key: 'technologyCost', label: 'Technology Cost ($)', hint: 'Platform, licensing, infrastructure' },
                  { key: 'trainingCost', label: 'Training & Change Management ($)', hint: 'One-time training, onboarding, comms' },
                ].map(({ key, label, hint }) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <p className="text-xs text-muted-foreground mb-1">{hint}</p>
                    <Input
                      id={key}
                      type="number"
                      min={0}
                      value={costs[key as keyof typeof costs]}
                      onChange={(e) => setCosts((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder="0"
                      className="mt-0.5"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <Label htmlFor="costNotes">Notes</Label>
                  <Textarea
                    id="costNotes"
                    value={costs.notes}
                    onChange={(e) => setCosts((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Explain cost assumptions or breakdown..."
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={onCostsFinish}>
                  View Results Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
