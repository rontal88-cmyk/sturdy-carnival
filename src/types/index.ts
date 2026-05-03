export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type AssumptionSource = 'internal_data' | 'research' | 'expert_estimate' | 'pilot_results';
export type StakeholderType =
  | 'hospital_management'
  | 'hmo_payer'
  | 'ministry_health'
  | 'funder_donor'
  | 'clinical_leader'
  | 'innovation_team';

export type ImpactAreaId =
  | 'clinical_outcomes'
  | 'access_to_care'
  | 'patient_experience'
  | 'health_equity'
  | 'operational_efficiency'
  | 'staff_workload'
  | 'financial_value'
  | 'quality_safety'
  | 'continuity_of_care'
  | 'system_level_impact';

export type ScenarioType = 'conservative' | 'realistic' | 'optimistic';

export interface MetricEstimate {
  id: string;
  name: string;
  description: string;
  unit: string;
  baselineValue: number;
  expectedChangePct: number;
  populationSize: number;
  timeframeMonths: number;
  costPerUnit: number;
  confidenceLevel: ConfidenceLevel;
  assumptionSource: AssumptionSource;
  notes: string;
}

export interface ImpactArea {
  id: ImpactAreaId;
  selected: boolean;
  metrics: MetricEstimate[];
}

export interface CostInput {
  implementationCost: number;
  annualOperatingCost: number;
  staffingCost: number;
  technologyCost: number;
  trainingCost: number;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  targetPopulation: string;
  healthcareSetting: string;
  problemDescription: string;
  painPoints: string;
  proposedIntervention: string;
  mainStakeholders: StakeholderType[];
  intendedOutcomes: string;
  impactAreas: ImpactArea[];
  costInput: CostInput;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface MetricResult {
  metricId: string;
  areaId: ImpactAreaId;
  metricName: string;
  annualImpact: number;
  economicValue: number;
  confidenceLevel: ConfidenceLevel;
}

export interface ImpactAreaResult {
  areaId: ImpactAreaId;
  totalValue: number;
  pctOfTotal: number;
  metricCount: number;
}

export interface ScenarioResult {
  totalBenefit: number;
  netValue: number;
  roi: number | null;
  year1: number;
  year3: number;
  year5: number;
}

export interface CalculationResults {
  totalAnnualBenefit: number;
  totalImplementationCost: number;
  totalAnnualOperatingCost: number;
  netValue: number;
  roi: number | null;
  breakEvenMonths: number | null;
  year1Value: number;
  year3Value: number;
  year5Value: number;
  scenarios: Record<ScenarioType, ScenarioResult>;
  metricResults: MetricResult[];
  impactAreaResults: ImpactAreaResult[];
}

export interface ImpactAreaTemplate {
  id: ImpactAreaId;
  label: string;
  description: string;
  icon: string;
  color: string;
  suggestedMetrics: Omit<MetricEstimate, 'id'>[];
}

export interface StakeholderConfig {
  id: StakeholderType;
  label: string;
  description: string;
  icon: string;
  emphasizedAreaIds: ImpactAreaId[] | 'all';
  keyValueDimensions: string[];
  narrativeContext: string;
}
