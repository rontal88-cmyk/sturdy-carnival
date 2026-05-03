import type { StakeholderConfig } from '@/types';

export const STAKEHOLDER_CONFIG: StakeholderConfig[] = [
  {
    id: 'hospital_management',
    label: 'Hospital Management',
    description: 'C-suite, COO, CFO, department heads focused on operations, safety, and financial performance.',
    icon: '🏥',
    emphasizedAreaIds: ['operational_efficiency', 'financial_value', 'quality_safety', 'staff_workload'],
    keyValueDimensions: ['Cost savings', 'Capacity', 'Safety', 'ROI'],
    narrativeContext:
      'Hospital leadership prioritizes operational excellence, cost containment, and quality outcomes. This view highlights how the project reduces costs, improves capacity utilization, enhances safety standards, and delivers measurable return on investment.',
  },
  {
    id: 'hmo_payer',
    label: 'HMO / Payer',
    description: 'Health plan executives, actuaries, and population health managers focused on utilization and cost.',
    icon: '📋',
    emphasizedAreaIds: ['financial_value', 'clinical_outcomes', 'continuity_of_care', 'quality_safety'],
    keyValueDimensions: ['Cost avoidance', 'Readmissions', 'Adherence', 'Value-based outcomes'],
    narrativeContext:
      'Payers and HMOs seek evidence that interventions reduce costly utilization — hospitalizations, ER visits, and readmissions — while improving adherence and long-term health outcomes. This view emphasizes total cost of care reduction and value-based performance metrics.',
  },
  {
    id: 'ministry_health',
    label: 'Ministry of Health / Public Sector',
    description: 'Government health officials focused on public health, equity, prevention, and system scalability.',
    icon: '🏛️',
    emphasizedAreaIds: ['access_to_care', 'health_equity', 'system_level_impact', 'clinical_outcomes'],
    keyValueDimensions: ['Population reach', 'Equity', 'Prevention', 'Scalability'],
    narrativeContext:
      'Public sector stakeholders evaluate investments through the lens of population health, equitable access, and sustainable system impact. This view emphasizes how many people are reached, whether disparities are reduced, and whether the model can be scaled across the health system.',
  },
  {
    id: 'funder_donor',
    label: 'Funder / Donor',
    description: 'Philanthropic foundations, impact investors, and grant-making bodies focused on social return.',
    icon: '🤝',
    emphasizedAreaIds: ['health_equity', 'system_level_impact', 'access_to_care', 'patient_experience'],
    keyValueDimensions: ['Social reach', 'Equity impact', 'Scalability', 'Cost per beneficiary'],
    narrativeContext:
      "Funders and donors evaluate impact through the lens of social value — how many lives are improved, whether underserved populations benefit, and whether the investment can be leveraged for broader change. This view presents the project's human impact alongside its potential for scale.",
  },
  {
    id: 'clinical_leader',
    label: 'Clinical Department Leader',
    description: 'Department heads, clinical directors, and senior clinicians focused on outcomes and workflow.',
    icon: '👨‍⚕️',
    emphasizedAreaIds: ['clinical_outcomes', 'staff_workload', 'quality_safety', 'patient_experience'],
    keyValueDimensions: ['Patient outcomes', 'Clinical quality', 'Staff burden', 'Guideline adherence'],
    narrativeContext:
      'Clinical leaders care deeply about patient outcomes, evidence quality, and the impact on their clinical teams. This view highlights measurable health improvements, safety enhancements, reductions in staff burden, and improvements to the care experience.',
  },
  {
    id: 'innovation_team',
    label: 'Innovation Team',
    description: 'Internal innovation leads, project managers, and digital health teams tracking all impact dimensions.',
    icon: '💡',
    emphasizedAreaIds: 'all',
    keyValueDimensions: ['Full impact', 'All dimensions', 'Assumptions', 'Scenario analysis'],
    narrativeContext:
      'The innovation team needs a complete, transparent view of all estimated impacts, underlying assumptions, and scenario analyses. This view presents all impact areas with full detail to support internal decision-making, iteration, and communication with multiple stakeholders.',
  },
];
