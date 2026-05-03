import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, ArrowRight, BarChart3, FileText, TrendingUp, Users } from 'lucide-react';

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <FileText className="h-6 w-6" />,
    title: 'Describe Your Project',
    description:
      'Enter your project details: target population, setting, problem being addressed, and proposed intervention.',
  },
  {
    step: '02',
    icon: <Activity className="h-6 w-6" />,
    title: 'Select Impact Areas',
    description:
      'Choose from 10 impact dimensions — from clinical outcomes to financial value to health equity.',
  },
  {
    step: '03',
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Build Your Metrics',
    description:
      'Estimate the expected change, population size, and economic value for each impact metric. Every assumption is editable.',
  },
  {
    step: '04',
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Model Scenarios',
    description:
      'See conservative, realistic, and optimistic projections over 1, 3, and 5 years with full uncertainty display.',
  },
  {
    step: '05',
    icon: <Users className="h-6 w-6" />,
    title: 'Present to Stakeholders',
    description:
      'Generate tailored reports for hospital management, HMOs, funders, and clinical leaders — each emphasizing what matters most to them.',
  },
];

const IMPACT_AREAS = [
  { icon: '🩺', label: 'Clinical Outcomes' },
  { icon: '🚪', label: 'Access to Care' },
  { icon: '😊', label: 'Patient Experience' },
  { icon: '⚖️', label: 'Health Equity' },
  { icon: '⚙️', label: 'Operational Efficiency' },
  { icon: '👩‍⚕️', label: 'Staff Workload' },
  { icon: '💰', label: 'Financial Value' },
  { icon: '🛡️', label: 'Quality & Safety' },
  { icon: '🔗', label: 'Continuity of Care' },
  { icon: '🌐', label: 'System-Level Impact' },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">HealthImpact</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/projects">
            <Button variant="ghost" className="text-white hover:bg-white/10">My Projects</Button>
          </Link>
          <Link to="/projects/new">
            <Button className="bg-teal-500 hover:bg-teal-400 text-white">
              New Evaluation
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-1.5 text-teal-300 text-sm font-medium mb-6">
          <Activity className="h-4 w-4" />
          Healthcare Innovation Evaluation Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Turn Healthcare Innovation
          <br />
          <span className="text-teal-400">Into Credible Impact</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          Estimate, model, and communicate the value of your healthcare project to the stakeholders
          who matter — clinicians, executives, funders, and policymakers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/projects/new">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-white px-8 text-base">
              Start New Evaluation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/projects/demo-rpm-diabetes-2024">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 text-base">
              View Demo Project
            </Button>
          </Link>
        </div>
      </section>

      {/* Impact areas preview */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">10 Impact Dimensions</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {IMPACT_AREAS.map((area) => (
            <div
              key={area.label}
              className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm"
            >
              <span>{area.icon}</span>
              {area.label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A guided 5-step process to transform project activities into stakeholder-ready impact stories.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <Card key={item.step} className="border-0 shadow-none text-center">
                <CardContent className="pt-6 pb-4 px-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-teal-600 mb-1">Step {item.step}</div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Estimate, Not Calculate',
                description:
                  "Every output is presented as a model with clear uncertainty ranges — never as precise financial truth. Stakeholders trust estimates that are honest about what they don't know.",
              },
              {
                icon: '🔧',
                title: 'Every Assumption is Editable',
                description:
                  'No black boxes. All inputs, formulas, and assumptions are transparent and adjustable. You can explain the logic behind every number.',
              },
              {
                icon: '👥',
                title: 'Built for Multiple Audiences',
                description:
                  "Generate tailored views for hospital management, funders, HMOs, and clinical teams — each emphasizing the value dimensions they care about most.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to make your impact visible?</h2>
          <p className="text-teal-200 mb-8">
            Start with your first project evaluation in minutes, or explore the demo to see the full experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects/new">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 px-8">
                Start New Project
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 px-8">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-6 px-6 text-center">
        <p className="text-slate-500 text-sm">
          HealthImpact — Healthcare Innovation Evaluation Platform ·{' '}
          <span className="text-slate-600">All outputs are estimates. Every assumption is editable and transparent.</span>
        </p>
      </footer>
    </div>
  );
}
