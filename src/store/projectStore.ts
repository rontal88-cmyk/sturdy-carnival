import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_PROJECT } from '@/data/demoProject';
import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import type { Project, ImpactArea, MetricEstimate, CostInput, ImpactAreaId, StakeholderType } from '@/types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultImpactAreas(): ImpactArea[] {
  return IMPACT_AREA_TEMPLATES.map((t) => ({ id: t.id, selected: false, metrics: [] }));
}

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;

  createProject: (data: {
    name: string;
    targetPopulation: string;
    healthcareSetting: string;
    problemDescription: string;
    painPoints: string;
    proposedIntervention: string;
    intendedOutcomes: string;
    mainStakeholders: StakeholderType[];
  }) => string;
  updateProject: (id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'impactAreas' | 'costInput'>>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;

  toggleImpactArea: (projectId: string, areaId: ImpactAreaId, selected: boolean) => void;
  addMetric: (projectId: string, areaId: ImpactAreaId, metric: Omit<MetricEstimate, 'id'>) => void;
  updateMetric: (projectId: string, areaId: ImpactAreaId, metricId: string, data: Partial<MetricEstimate>) => void;
  deleteMetric: (projectId: string, areaId: ImpactAreaId, metricId: string) => void;

  updateCosts: (projectId: string, costs: Partial<CostInput>) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, _get) => ({
      projects: [DEMO_PROJECT],
      currentProjectId: null,

      createProject: (data) => {
        const id = generateId();
        const now = new Date().toISOString();
        const project: Project = {
          id,
          ...data,
          impactAreas: defaultImpactAreas(),
          costInput: {
            implementationCost: 0,
            annualOperatingCost: 0,
            staffingCost: 0,
            technologyCost: 0,
            trainingCost: 0,
            notes: '',
          },
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ projects: [...s.projects, project], currentProjectId: id }));
        return id;
      },

      updateProject: (id, data) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          currentProjectId: s.currentProjectId === id ? null : s.currentProjectId,
        })),

      setCurrentProject: (id) => set({ currentProjectId: id }),

      toggleImpactArea: (projectId, areaId, selected) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id !== projectId
              ? p
              : {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  impactAreas: p.impactAreas.map((a) =>
                    a.id === areaId ? { ...a, selected } : a
                  ),
                }
          ),
        })),

      addMetric: (projectId, areaId, metricData) => {
        const metric: MetricEstimate = { id: generateId(), ...metricData };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id !== projectId
              ? p
              : {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  impactAreas: p.impactAreas.map((a) =>
                    a.id === areaId ? { ...a, metrics: [...a.metrics, metric] } : a
                  ),
                }
          ),
        }));
      },

      updateMetric: (projectId, areaId, metricId, data) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id !== projectId
              ? p
              : {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  impactAreas: p.impactAreas.map((a) =>
                    a.id !== areaId
                      ? a
                      : {
                          ...a,
                          metrics: a.metrics.map((m) =>
                            m.id === metricId ? { ...m, ...data } : m
                          ),
                        }
                  ),
                }
          ),
        })),

      deleteMetric: (projectId, areaId, metricId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id !== projectId
              ? p
              : {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  impactAreas: p.impactAreas.map((a) =>
                    a.id !== areaId
                      ? a
                      : { ...a, metrics: a.metrics.filter((m) => m.id !== metricId) }
                  ),
                }
          ),
        })),

      updateCosts: (projectId, costs) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id !== projectId
              ? p
              : {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  costInput: { ...p.costInput, ...costs },
                }
          ),
        })),
    }),
    {
      name: 'healthimpact-projects',
      version: 1,
      // Merge persisted state with demo project if new session
      merge: (persisted, current) => {
        const p = persisted as Partial<ProjectStore>;
        const projects = p.projects ?? [];
        const hasDemo = projects.some((pr) => pr.id === DEMO_PROJECT.id);
        return {
          ...current,
          ...p,
          projects: hasDemo ? projects : [DEMO_PROJECT, ...projects],
        };
      },
    }
  )
);

// Selectors
export const selectProject = (id: string) => (state: ProjectStore) =>
  state.projects.find((p) => p.id === id);

export const selectCurrentProject = (state: ProjectStore) =>
  state.projects.find((p) => p.id === state.currentProjectId) ?? null;
