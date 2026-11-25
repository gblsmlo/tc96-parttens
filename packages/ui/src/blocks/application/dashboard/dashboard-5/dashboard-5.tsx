import { Badge } from '@tc96/ui/badge'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import { CategoryBarChart } from '../shared/category-bar-chart'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardHeader } from '../shared/dashboard-header'
import { DashboardLink } from '../shared/dashboard-link'
import { DashboardLinkList } from '../shared/dashboard-link-list'
import {
  DashboardMetricCard,
  type DashboardMetricCardProps,
} from '../shared/dashboard-metric-card'
import { DashboardPanel } from '../shared/dashboard-panel'
import { DashboardPanelLink } from '../shared/dashboard-panel-link'
import { createDateFormatter } from '../shared/format-date'
import { createMoneyFormatter } from '../shared/format-money'
import { PeriodColumnChart } from '../shared/period-column-chart'
import { Dashboard5Skeleton } from './dashboard-5-skeleton'
import { defaultDashboard5Labels } from './labels'
import type { Dashboard5Props, Dashboard5Urgency } from './types'

const urgencyVariants: Record<
  Dashboard5Urgency,
  'error' | 'secondary' | 'warning'
> = {
  later: 'secondary',
  overdue: 'error',
  soon: 'warning',
  today: 'error',
}

const captureTones = {
  running: 'positive',
  simulated: 'neutral',
  stopped: 'negative',
} as const

const dueDaySeries = [{ color: 'var(--chart-1)', id: 'due' }]

export function Dashboard5({
  appointments,
  breadcrumbs,
  className,
  currency,
  deadlines,
  dueDays = [],
  error = false,
  labels: labelsProp,
  links = {},
  locale,
  metrics = {},
  onRetry,
  pending = false,
  publications,
  queues,
  renderLink = renderAnchor,
  timeZone,
}: Readonly<Dashboard5Props>) {
  const labels = { ...defaultDashboard5Labels, ...labelsProp }
  const numbers = createMoneyFormatter({ currency, locale })
  const dates = createDateFormatter({ locale, timeZone })
  const formatCount = numbers.count
  const dueDayData = dueDays.map((day) => ({
    period: dates.dayMonth(day.date),
    series: 'due',
    value: day.count,
  }))

  if (pending) {
    return (
      <Dashboard5Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const metricCards: DashboardMetricCardProps[] = []
  if (metrics.dueSoon) {
    metricCards.push({
      detail: metrics.dueSoon.detail,
      href: metrics.dueSoon.href,
      id: 'due-soon',
      label: labels.dueSoonLabel,
      tone: metrics.dueSoon.count > 0 ? 'warning' : 'neutral',
      value: formatCount(metrics.dueSoon.count),
    })
  }
  if (metrics.overdue) {
    metricCards.push({
      detail: metrics.overdue.detail,
      href: metrics.overdue.href,
      id: 'overdue',
      label: labels.overdueLabel,
      tone: metrics.overdue.count > 0 ? 'negative' : 'neutral',
      value: formatCount(metrics.overdue.count),
    })
  }
  if (metrics.publications) {
    metricCards.push({
      detail: metrics.publications.detail,
      href: metrics.publications.href,
      id: 'publications',
      label: labels.publicationsLabel,
      value: formatCount(metrics.publications.count),
    })
  }
  if (metrics.capture) {
    metricCards.push({
      detail: metrics.capture.detail,
      href: metrics.capture.href,
      id: 'capture',
      label: labels.captureLabel,
      tone: captureTones[metrics.capture.state],
      value: labels.captureStates[metrics.capture.state],
    })
  }

  const isEmpty =
    metricCards.length === 0 &&
    deadlines.length === 0 &&
    (publications ?? []).length === 0 &&
    appointments.length === 0 &&
    queues.length === 0 &&
    dueDays.length === 0

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-5"
    >
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        labels={labels}
        renderLink={renderLink}
      />
      {error ? (
        <DashboardError
          description={labels.errorDescription}
          onRetry={onRetry}
          retry={labels.retry}
          title={labels.errorTitle}
        />
      ) : isEmpty ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <>
          {metricCards.length > 0 ? (
            <ul
              aria-label={labels.indicators}
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4"
            >
              {metricCards.map((card) => (
                <li className="min-w-0" key={card.id}>
                  <DashboardMetricCard {...card} renderLink={renderLink} />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <DashboardPanel
              action={
                links.deadlines ? (
                  <DashboardPanelLink
                    href={links.deadlines}
                    label={labels.deadlinesLink}
                    renderLink={renderLink}
                  />
                ) : undefined
              }
              title={labels.deadlinesTitle}
            >
              <DashboardLinkList
                empty={labels.deadlinesEmpty}
                items={deadlines.map((deadline) => ({
                  description: labels.fatalOn(
                    deadline.lawsuitTitle,
                    dates.dayMonth(deadline.fatalDate),
                  ),
                  href: deadline.href,
                  id: deadline.id,
                  title: deadline.title,
                  trailing: (
                    <Badge
                      data-urgency={deadline.urgency}
                      variant={urgencyVariants[deadline.urgency]}
                    >
                      {deadline.daysLeft}
                    </Badge>
                  ),
                }))}
                label={labels.deadlinesTitle}
                renderLink={renderLink}
              />
            </DashboardPanel>
            {publications ? (
              <DashboardPanel
                action={
                  links.publications ? (
                    <DashboardPanelLink
                      href={links.publications}
                      label={labels.publicationsLink}
                      renderLink={renderLink}
                    />
                  ) : undefined
                }
                title={labels.publicationsTitle}
              >
                <DashboardLinkList
                  empty={labels.publicationsEmpty}
                  items={publications.map((publication) => ({
                    description: publication.description,
                    href: publication.href,
                    id: publication.id,
                    title: publication.title,
                    trailing: <Badge variant="outline">{labels.decide}</Badge>,
                  }))}
                  label={labels.publicationsTitle}
                  renderLink={renderLink}
                />
              </DashboardPanel>
            ) : null}
            {dueDays.length > 0 ? (
              <DashboardPanel title={labels.dueDaysTitle}>
                <PeriodColumnChart
                  columnTooltip={(datum) =>
                    labels.dueDaysTooltip(
                      datum.period,
                      formatCount(datum.value),
                    )
                  }
                  data={dueDayData}
                  formatAxis={formatCount}
                  height={200}
                  label={labels.dueDaysLabel}
                  periods={dueDayData.map((datum) => datum.period)}
                  series={dueDaySeries}
                  summary={labels.dueDaysSummary(
                    dueDayData.map((datum) => ({
                      count: formatCount(datum.value),
                      label: datum.period,
                    })),
                  )}
                />
              </DashboardPanel>
            ) : null}
            <DashboardPanel title={labels.queuesTitle}>
              {queues.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {labels.queuesEmpty}
                </p>
              ) : (
                <>
                  <CategoryBarChart
                    data={queues.map((queue) => ({
                      id: queue.id,
                      label: queue.label,
                      value: queue.count,
                    }))}
                    formatValue={formatCount}
                    label={labels.queuesLabel}
                    summary={labels.queuesSummary(
                      queues.map((queue) => ({
                        count: formatCount(queue.count),
                        label: queue.label,
                      })),
                    )}
                    tooltipText={(datum) =>
                      labels.queuesTooltip(
                        datum.label,
                        formatCount(datum.value),
                      )
                    }
                  />
                  <ul
                    aria-label={labels.queuesTitle}
                    className="m-0 grid list-none gap-1 p-0"
                  >
                    {queues.map((queue) => (
                      <li
                        className="flex items-center justify-between gap-3 text-sm"
                        data-queue={queue.id}
                        key={queue.id}
                      >
                        {queue.href ? (
                          <DashboardLink
                            className="hover:underline"
                            href={queue.href}
                            renderLink={renderLink}
                          >
                            {queue.label}
                          </DashboardLink>
                        ) : (
                          <span>{queue.label}</span>
                        )}
                        <span className="font-medium tabular-nums">
                          {formatCount(queue.count)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </DashboardPanel>
            <DashboardPanel
              action={
                links.agenda ? (
                  <DashboardPanelLink
                    href={links.agenda}
                    label={labels.agendaLink}
                    renderLink={renderLink}
                  />
                ) : undefined
              }
              title={labels.appointmentsTitle}
            >
              <DashboardLinkList
                empty={labels.appointmentsEmpty}
                items={appointments.map((appointment) => ({
                  description: appointment.recordTitle,
                  href: appointment.href,
                  id: appointment.id,
                  title: appointment.title,
                  trailing: (
                    <Badge variant="secondary">
                      {labels.appointmentWhen(
                        dates.dayMonth(appointment.startsAt),
                        dates.time(appointment.startsAt),
                      )}
                    </Badge>
                  ),
                }))}
                label={labels.appointmentsTitle}
                renderLink={renderLink}
              />
            </DashboardPanel>
          </div>
        </>
      )}
    </section>
  )
}
