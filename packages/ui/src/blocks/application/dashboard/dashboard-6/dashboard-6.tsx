import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { renderAnchor } from '@tc96/ui/render-anchor'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { CategoryBarChart } from '../shared/category-bar-chart'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardHeader } from '../shared/dashboard-header'
import { DashboardLink } from '../shared/dashboard-link'
import { DashboardMetricCard } from '../shared/dashboard-metric-card'
import { DashboardPanel } from '../shared/dashboard-panel'
import { createMoneyFormatter } from '../shared/format-money'
import { Dashboard6Skeleton } from './dashboard-6-skeleton'
import { defaultDashboard6Labels } from './labels'
import type { Dashboard6Props } from './types'

export function Dashboard6({
  breadcrumbs,
  className,
  currency,
  error = false,
  labels: labelsProp,
  locale,
  lossReasons,
  onPeriodChange,
  onRetry,
  pending = false,
  period,
  periodOptions,
  renderLink = renderAnchor,
  stages,
  summary,
}: Readonly<Dashboard6Props>) {
  const labels = { ...defaultDashboard6Labels, ...labelsProp }

  if (pending) {
    return (
      <Dashboard6Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const numbers = createMoneyFormatter({ currency, locale })
  const leads = (count: number) => labels.leadCount(count, numbers.count(count))
  const isEmpty =
    summary === undefined && stages.length === 0 && lossReasons.length === 0

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-6"
    >
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        labels={labels}
        onPeriodChange={onPeriodChange}
        period={period}
        periodOptions={periodOptions}
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
          {summary ? (
            <ul
              aria-label={labels.indicators}
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4"
            >
              <li className="min-w-0">
                <DashboardMetricCard
                  detail={numbers.cents(summary.open.valueCents)}
                  id="open"
                  label={labels.openLabel}
                  value={leads(summary.open.count)}
                />
              </li>
              <li className="min-w-0">
                <DashboardMetricCard
                  detail={numbers.cents(summary.won.valueCents)}
                  id="won"
                  label={labels.wonLabel}
                  tone={summary.won.count > 0 ? 'positive' : 'neutral'}
                  value={leads(summary.won.count)}
                />
              </li>
              <li className="min-w-0">
                <DashboardMetricCard
                  detail={numbers.cents(summary.lost.valueCents)}
                  id="lost"
                  label={labels.lostLabel}
                  value={leads(summary.lost.count)}
                />
              </li>
              <li className="min-w-0">
                <DashboardMetricCard
                  detail={labels.conversionDetail}
                  id="conversion"
                  label={labels.conversionLabel}
                  value={
                    summary.conversion === null
                      ? labels.noConversion
                      : numbers.percent(summary.conversion)
                  }
                />
              </li>
            </ul>
          ) : null}
          <div className="grid items-start gap-4 xl:grid-cols-[3fr_2fr]">
            <DashboardPanel title={labels.funnelTitle}>
              {summary ? (
                <div className="grid gap-0.5">
                  <span className="text-muted-foreground text-xs">
                    {labels.funnelTotal}
                  </span>
                  <span
                    className="font-semibold text-xl tabular-nums"
                    data-slot="dashboard-funnel-total"
                  >
                    {numbers.cents(summary.open.valueCents)}
                  </span>
                </div>
              ) : null}
              {stages.length > 0 ? (
                <>
                  <CategoryBarChart
                    data={stages.map((stage) => ({
                      id: stage.id,
                      label: stage.name,
                      value: stage.count,
                    }))}
                    formatValue={leads}
                    label={labels.funnelLabel}
                    summary={labels.funnelSummary(
                      stages.map((stage) => ({
                        count: leads(stage.count),
                        label: stage.name,
                      })),
                    )}
                    tooltipText={(datum) =>
                      labels.tooltip(datum.label, leads(datum.value))
                    }
                  />
                  <Table aria-label={labels.funnelLabel}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{labels.columnStage}</TableHead>
                        <TableHead className="text-right">
                          {labels.columnLeads}
                        </TableHead>
                        <TableHead className="text-right">
                          {labels.columnValue}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stages.map((stage) => (
                        <TableRow data-stage={stage.id} key={stage.id}>
                          <TableCell>
                            {stage.href ? (
                              <DashboardLink
                                className="font-medium hover:underline"
                                href={stage.href}
                                renderLink={renderLink}
                              >
                                {stage.name}
                              </DashboardLink>
                            ) : (
                              <span className="font-medium">{stage.name}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {numbers.count(stage.count)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {numbers.cents(stage.valueCents)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : null}
            </DashboardPanel>
            <DashboardPanel title={labels.lossesTitle}>
              {lossReasons.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {labels.lossesEmpty}
                </p>
              ) : (
                <CategoryBarChart
                  color="var(--chart-2)"
                  data={lossReasons.map((reason) => ({
                    id: reason.id,
                    label: reason.name,
                    value: reason.count,
                  }))}
                  formatValue={leads}
                  label={labels.lossesLabel}
                  summary={labels.lossesSummary(
                    lossReasons.map((reason) => ({
                      count: leads(reason.count),
                      label: reason.name,
                    })),
                  )}
                  tooltipText={(datum) =>
                    labels.tooltip(datum.label, leads(datum.value))
                  }
                />
              )}
            </DashboardPanel>
          </div>
        </>
      )}
    </section>
  )
}
