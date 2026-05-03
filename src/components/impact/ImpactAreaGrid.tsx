import { IMPACT_AREA_TEMPLATES } from '@/data/impactAreaTemplates';
import type { ImpactArea } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ImpactAreaGridProps {
  impactAreas: ImpactArea[];
  onToggle: (id: string, selected: boolean) => void;
  suggestedIds?: string[];
  readOnly?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  teal: 'border-teal-200 bg-teal-50 hover:bg-teal-100',
  blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
  orange: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
  purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
  indigo: 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
  rose: 'border-rose-200 bg-rose-50 hover:bg-rose-100',
  green: 'border-green-200 bg-green-50 hover:bg-green-100',
  cyan: 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100',
  amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
  violet: 'border-violet-200 bg-violet-50 hover:bg-violet-100',
};

const SELECTED_COLOR_MAP: Record<string, string> = {
  teal: 'border-teal-500 bg-teal-100 ring-2 ring-teal-500',
  blue: 'border-blue-500 bg-blue-100 ring-2 ring-blue-500',
  orange: 'border-orange-500 bg-orange-100 ring-2 ring-orange-500',
  purple: 'border-purple-500 bg-purple-100 ring-2 ring-purple-500',
  indigo: 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-500',
  rose: 'border-rose-500 bg-rose-100 ring-2 ring-rose-500',
  green: 'border-green-500 bg-green-100 ring-2 ring-green-500',
  cyan: 'border-cyan-500 bg-cyan-100 ring-2 ring-cyan-500',
  amber: 'border-amber-500 bg-amber-100 ring-2 ring-amber-500',
  violet: 'border-violet-500 bg-violet-100 ring-2 ring-violet-500',
};

export function ImpactAreaGrid({ impactAreas, onToggle, suggestedIds = [], readOnly = false }: ImpactAreaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {IMPACT_AREA_TEMPLATES.map((template) => {
        const area = impactAreas.find((a) => a.id === template.id);
        const selected = area?.selected ?? false;
        const isSuggested = suggestedIds.includes(template.id);
        const colorBase = COLOR_MAP[template.color] ?? COLOR_MAP['teal'];
        const colorSelected = SELECTED_COLOR_MAP[template.color] ?? SELECTED_COLOR_MAP['teal'];

        return (
          <button
            key={template.id}
            type="button"
            disabled={readOnly}
            onClick={() => onToggle(template.id, !selected)}
            className={cn(
              'relative text-left rounded-lg border-2 p-3 transition-all cursor-pointer',
              selected ? colorSelected : colorBase,
              readOnly && 'cursor-default'
            )}
          >
            {isSuggested && !selected && (
              <span className="absolute top-1.5 right-1.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                Suggested
              </span>
            )}
            {selected && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </span>
            )}
            <div className="text-2xl mb-1.5">{template.icon}</div>
            <div className="font-semibold text-sm text-foreground leading-tight mb-1">
              {template.label}
            </div>
            <div className="text-xs text-muted-foreground leading-tight line-clamp-2">
              {template.description}
            </div>
            {area && area.metrics.length > 0 && (
              <div className="mt-2 text-xs font-medium text-primary">
                {area.metrics.length} metric{area.metrics.length !== 1 ? 's' : ''}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
