import { BookmarkSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { formatAmount } from '@tc96/ui/helpers/format'
import { getInitials } from '@tc96/ui/helpers/initials'
import { IconFrame } from '@tc96/ui/icon-frame'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { WidgetShell } from '@tc96/ui/patterns/widgets/shared/widget-shell'
import { Toggle } from '@tc96/ui/toggle'
import { useId } from 'react'
import { cardLoadState } from '../shared/card-load-state'
import { Card6Skeleton } from './card-6-skeleton'
import { defaultCard6Labels } from './labels'
import type { Card6Job, Card6Labels, Card6Props, Card6WorkMode } from './types'

const workModeVariants = {
  hybrid: 'info',
  onsite: 'secondary',
  remote: 'success',
} as const satisfies Record<Card6WorkMode, string>

interface JobCardProps {
  currency: string
  isSaved: boolean
  job: Card6Job
  labels: Card6Labels
  locale: string
  onApply?: Card6Props['onApply']
  onSaveChange?: Card6Props['onSaveChange']
}

function JobCard({
  currency,
  isSaved,
  job,
  labels,
  locale,
  onApply,
  onSaveChange,
}: Readonly<JobCardProps>) {
  const titleId = useId()
  const money = (value: number) =>
    formatAmount(value, {
      currency: job.salary?.currency ?? currency,
      locale,
      maximumFractionDigits: 0,
      style: 'currency',
    })

  return (
    <WidgetShell aria-labelledby={titleId} data-job={job.id}>
      <CardPanel className="grid gap-4 p-5">
        <div className="flex items-start gap-3">
          <IconFrame shape="rounded" size="lg">
            <span className="font-medium text-sm">
              {getInitials(job.company)}
            </span>
          </IconFrame>
          <div className="grid min-w-0 flex-1 gap-0.5">
            <h3 className="truncate font-medium" id={titleId}>
              {job.title}
            </h3>
            <p className="truncate text-muted-foreground text-sm">
              {job.company}
            </p>
          </div>
          {onSaveChange ? (
            <Toggle
              aria-label={
                isSaved ? labels.unsave(job.title) : labels.save(job.title)
              }
              onPressedChange={(next) => onSaveChange(job.id, next)}
              pressed={isSaved}
              size="sm"
              variant="outline"
            >
              <BookmarkSimpleIcon weight={isSaved ? 'fill' : 'regular'} />
            </Toggle>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge size="large" variant={workModeVariants[job.workMode]}>
            {labels.workModes[job.workMode]}
          </Badge>
          <span className="text-muted-foreground">{job.location}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          {job.salary ? (
            <p
              className="font-medium text-sm tabular-nums"
              data-slot="card-6-salary"
            >
              {labels.salary(money(job.salary.min), money(job.salary.max))}
            </p>
          ) : (
            <span />
          )}
          {onApply ? (
            <Button
              aria-label={labels.applyTo(job.title, job.company)}
              onClick={() => onApply(job.id)}
              size="sm"
            >
              {labels.apply}
            </Button>
          ) : null}
        </div>
      </CardPanel>
    </WidgetShell>
  )
}

export function Card6({
  error,
  onRetry,
  pending,
  className,
  currency = 'BRL',
  jobs,
  labels: labelsProp,
  locale = 'pt-BR',
  onApply,
  onSaveChange,
  saved = [],
}: Readonly<Card6Props>) {
  const labels = { ...defaultCard6Labels, ...labelsProp }
  const loadState = cardLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Card6Skeleton label={labels.loading} />,
  })

  if (loadState)
    return (
      <section aria-label={labels.title} className={className}>
        {loadState}
      </section>
    )

  if (jobs.length === 0) {
    return (
      <StateSurface
        className={className}
        description={labels.emptyDescription}
        kind="empty"
        title={labels.emptyTitle}
      />
    )
  }

  return (
    <section aria-label={labels.title} className={className}>
      <ul className="grid list-none gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <li className="min-w-0" key={job.id}>
            <JobCard
              currency={currency}
              isSaved={saved.includes(job.id)}
              job={job}
              labels={labels}
              locale={locale}
              onApply={onApply}
              onSaveChange={onSaveChange}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
