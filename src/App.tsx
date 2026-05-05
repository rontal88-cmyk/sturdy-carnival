import { HashRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HomePage } from '@/pages/HomePage';
import { ProjectsListPage } from '@/pages/ProjectsListPage';
import { NewProjectPage } from '@/pages/NewProjectPage';
import { ProjectProfilePage } from '@/pages/ProjectProfilePage';
import { ImpactBuilderPage } from '@/pages/ImpactBuilderPage';
import { ResultsDashboardPage } from '@/pages/ResultsDashboardPage';
import { ScenarioAnalysisPage } from '@/pages/ScenarioAnalysisPage';
import { ExportReportPage } from '@/pages/ExportReportPage';

export default function App() {
  return (
    <TooltipProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:id" element={<ProjectProfilePage />} />
          <Route path="/projects/:id/impact" element={<ImpactBuilderPage />} />
          <Route path="/projects/:id/results" element={<ResultsDashboardPage />} />
          <Route path="/projects/:id/scenarios" element={<ScenarioAnalysisPage />} />
          <Route path="/projects/:id/report" element={<ExportReportPage />} />
          <Route path="/projects/:id/report/:stakeholder" element={<ExportReportPage />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  );
}
