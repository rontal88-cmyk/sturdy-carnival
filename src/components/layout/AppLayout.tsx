import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  FolderOpen,
  BarChart3,
  TrendingUp,
  FileText,
  ChevronLeft,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store/projectStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
}

function GlobalNav() {
  return [
    { label: 'Home', href: '/', icon: <Home className="h-4 w-4" />, exact: true },
    { label: 'Projects', href: '/projects', icon: <FolderOpen className="h-4 w-4" /> },
  ];
}

function ProjectNav(projectId: string): NavItem[] {
  return [
    { label: 'Project Profile', href: `/projects/${projectId}`, icon: <FolderOpen className="h-4 w-4" />, exact: true },
    { label: 'Impact Builder', href: `/projects/${projectId}/impact`, icon: <Activity className="h-4 w-4" /> },
    { label: 'Results Dashboard', href: `/projects/${projectId}/results`, icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Scenario Analysis', href: `/projects/${projectId}/scenarios`, icon: <TrendingUp className="h-4 w-4" /> },
    { label: 'Stakeholder Report', href: `/projects/${projectId}/report`, icon: <FileText className="h-4 w-4" /> },
  ];
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { id } = useParams();
  const projects = useProjectStore((s) => s.projects);
  const project = id ? projects.find((p) => p.id === id) : null;

  const globalNav = GlobalNav();
  const projectNav = id ? ProjectNav(id) : [];

  function isActive(href: string, exact?: boolean) {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-bold text-sm text-foreground">HealthImpact</div>
          <div className="text-xs text-muted-foreground">Innovation Evaluator</div>
        </div>
      </div>

      {/* Global nav */}
      <nav className="px-3 py-4 space-y-1">
        {globalNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              isActive(item.href, item.exact)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Project-specific nav */}
      {project && (
        <>
          <div className="px-4 py-2 border-t">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Current Project
            </div>
            <div className="text-sm font-medium text-foreground truncate">{project.name}</div>
          </div>
          <nav className="px-3 py-2 space-y-1">
            {projectNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive(item.href, item.exact)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      <div className="mt-auto px-4 py-4 border-t">
        <div className="text-xs text-muted-foreground">
          All estimates are models, not financial guarantees. Every assumption is editable.
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col shrink-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 border-r bg-card flex flex-col overflow-y-auto transition-transform lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-end p-3 border-b">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b bg-card shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            <Link to="/" className="hover:text-foreground shrink-0">Home</Link>
            {project && (
              <>
                <span>/</span>
                <Link to="/projects" className="hover:text-foreground shrink-0">Projects</Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate">{project.name}</span>
              </>
            )}
          </div>

          {project && (
            <Link to="/projects" className="ml-auto shrink-0">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                All Projects
              </Button>
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
