import { formatShortDate, parseIsoDate } from '@tc96/helpers/date'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Badge } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import { TimelineError } from '../shared/timeline-error'
import { TimelineItem } from '../shared/timeline-item'
import { TimelineList } from '../shared/timeline-list'
import { defaultTimeline2Labels } from './labels'
import { Timeline2Skeleton } from './timeline-2-skeleton'
import type { Timeline2ChangeType, Timeline2Props } from './types'

const tones = {
  fix: 'warning',
  improvement: 'info',
  new: 'success',
} as const satisfies Record<Timeline2ChangeType, string>

function formatDay(value: string, locale: string) {
  const date = parseIsoDate(value)
  return date ? formatShortDate(date, locale, 'UTC') : value
}

export function Timeline2({
  className,
  error = false,
  labels: labelsProp,
  locale = 'pt-BR',
  onRetry,
  pending = false,
  releases,
}: Readonly<Timeline2Props>) {
  const labels = {
    ...defaultTimeline2Labels,
    ...labelsProp,
    types: { ...defaultTimeline2Labels.types, ...labelsProp?.types },
  }

  if (pending) {
    return (
      <Timeline2Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  return (
    <section aria-label={labels.title} className={cn('grid gap-4', className)}>
      <h3 className="font-medium text-base">{labels.title}</h3>
      {error ? (
        <TimelineError
          description={labels.errorDescription}
          onRetry={onRetry}
          retry={labels.retry}
          title={labels.errorTitle}
        />
      ) : releases.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <TimelineList label={labels.title}>
          {releases.map((release, index) => (
            <TimelineItem
              key={release.id}
              last={index === releases.length - 1}
              marker={
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2.5 rounded-full bg-primary"
                />
              }
            >
              <div
                className="grid gap-3 sm:grid-cols-[7rem_1fr]"
                data-release={release.id}
              >
                <time
                  className="text-muted-foreground text-sm"
                  dateTime={release.date}
                >
                  {formatDay(release.date, locale)}
                </time>
                <div className="grid gap-3">
                  <h4 className="font-medium text-sm">{release.version}</h4>
                  {release.entries.map((entry) => (
                    <div
                      className="grid justify-items-start gap-1.5"
                      data-type={entry.type}
                      key={entry.id}
                    >
                      <Badge variant={tones[entry.type]}>
                        {labels.types[entry.type]}
                      </Badge>
                      <ul className="m-0 grid list-disc gap-1 pl-5 text-sm">
                        {entry.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </TimelineItem>
          ))}
        </TimelineList>
      )}
    </section>
  )
}
