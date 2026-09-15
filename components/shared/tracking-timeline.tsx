import { Check, Circle, AlertTriangle } from 'lucide-react';
import type { Shipment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TrackingTimelineProps {
  events: Shipment['trackingEvents'];
  className?: string;
}

export function TrackingTimeline({ events, className }: TrackingTimelineProps) {
  if (!events?.length) return null;

  return (
    <ol className={cn('relative pl-1 sm:pl-0', className)}>
      <div className="absolute left-4 sm:left-4 top-2 bottom-2 w-[2px] bg-border rounded-full overflow-hidden">
        <div
          className="timeline-line w-full rounded-full"
          style={{
            height: `${Math.max(
              8,
              (events.filter((e) => e.state === 'completed').length / Math.max(events.length - 1, 1)) * 100,
            )}%`,
          }}
        />
      </div>
      {events.map((ev, idx) => {
        const isLast = idx === events.length - 1;
        return (
          <li key={ev.id} className={cn('relative flex gap-4 py-4', isLast ? '' : '')}>
            <div
              className={cn(
                'relative z-10 flex-shrink-0 w-8 h-8 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2',
                ev.state === 'completed' &&
                  'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20',
                ev.state === 'current' &&
                  'bg-card border-primary text-primary ring-4 ring-primary/20 animate-pulse',
                ev.state === 'upcoming' &&
                  'bg-background border-border text-muted-foreground/60',
                ev.status === 'Exception' && ev.state !== 'upcoming' &&
                  'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20 ring-4 ring-rose-500/10',
              )}
            >
              {ev.state === 'completed' && ev.status !== 'Exception' && <Check className="w-3.5 h-3.5" />}
              {ev.state === 'upcoming' && <Circle className="w-2.5 h-2.5" />}
              {ev.state === 'current' && ev.status === 'Exception' && <AlertTriangle className="w-3.5 h-3.5" />}
              {ev.state === 'current' && ev.status !== 'Exception' && <Circle className="w-2.5 h-2.5 fill-primary" />}
            </div>
            <div
              className={cn(
                'flex-1 pb-2 min-w-0',
                ev.state === 'upcoming' ? 'opacity-50' : '',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4
                    className={cn(
                      'font-semibold text-sm sm:text-base',
                      ev.state === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                      ev.status === 'Exception' && ev.state !== 'upcoming' && 'text-rose-600 dark:text-rose-400',
                    )}
                  >
                    {ev.status}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{ev.location}</p>
                </div>
                {(ev.date || ev.time) && (
                  <div className="text-right text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                    {ev.date && <span className="block">{ev.date}</span>}
                    {ev.time && <span className="block text-[11px] sm:text-xs">{ev.time}</span>}
                  </div>
                )}
              </div>
              {ev.description && (
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{ev.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
