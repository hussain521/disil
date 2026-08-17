import { ReactNode } from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export type TimelineStepState = 'complete' | 'current' | 'upcoming' | 'error';

export interface TimelineStep {
  key: string;
  label: string;
  description?: ReactNode;
  timestamp?: string | null;
  state: TimelineStepState;
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

const DOT_CONFIG: Record<TimelineStepState, { bg: string; border: string; icon?: any }> = {
  complete: {
    bg: 'bg-emerald-500 text-white',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
  current: {
    bg: 'bg-admin-accent text-white shadow-md glow-accent-sm ring-4 ring-admin-accent/20',
    border: 'border-admin-accent',
    icon: Clock,
  },
  upcoming: {
    bg: 'bg-admin-surface text-admin-muted',
    border: 'border-admin-border',
  },
  error: {
    bg: 'bg-rose-500 text-white',
    border: 'border-rose-500/40',
    icon: AlertCircle,
  },
};

const LABEL_CLASSES: Record<TimelineStepState, string> = {
  complete: 'text-admin-text font-semibold',
  current: 'text-admin-text font-bold text-admin-accent',
  upcoming: 'text-admin-muted font-medium',
  error: 'text-rose-400 font-bold',
};

/**
 * Modern illuminated vertical status timeline:
 * - Glowing step nodes, semantic color coding, and sleek timestamps.
 */
export default function Timeline({ steps, className = '' }: TimelineProps) {
  return (
    <ol className={`space-y-0 ${className}`}>
      {steps.map((step, index) => {
        const config = DOT_CONFIG[step.state];
        const IconComponent = config.icon;

        return (
          <li key={step.key} className="relative flex gap-3.5 pb-6 last:pb-0">
            {index < steps.length - 1 ? (
              <span
                className="absolute left-[11px] top-5 h-full w-0.5 bg-admin-border"
                aria-hidden
              />
            ) : null}

            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all ${config.bg} ${config.border}`}
            >
              {IconComponent ? (
                <IconComponent className="h-3.5 w-3.5" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-xs ${LABEL_CLASSES[step.state]}`}>{step.label}</span>
                {step.timestamp ? (
                  <span className="shrink-0 font-mono text-[11px] text-admin-muted">
                    {step.timestamp}
                  </span>
                ) : null}
              </div>
              {step.description ? (
                <div className="mt-1 text-xs text-admin-subtext leading-relaxed">
                  {step.description}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
