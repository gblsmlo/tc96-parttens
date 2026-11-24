import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { getInitials } from '@tc96/ui/helpers/initials'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Progress } from '@tc96/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../shared/chart-frame'
import { ChartLegend, ChartTooltip } from '../shared/chart-tooltip'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardHeader } from '../shared/dashboard-header'
import { DashboardKpiCard } from '../shared/dashboard-kpi-card'
import { DashboardPagination } from '../shared/dashboard-pagination'
import { DashboardPanel } from '../shared/dashboard-panel'
import { DashboardSearch } from '../shared/dashboard-search'
import { createDashboardFormatter } from '../shared/format'
import { Dashboard3Skeleton } from './dashboard-3-skeleton'
import { defaultDashboard3Labels } from './labels'
import type { Dashboard3Props } from './types'

const supplyColor = 'var(--chart-1)'
const forecastColor = 'var(--chart-2)'

export function Dashboard3({
  breadcrumbs,
  className,
  crew,
  currency,
  error = false,
  forecast,
  kpis = [],
  labels: labelsProp,
  locale,
  onAction,
  onExport,
  onPageChange,
  onPeriodChange,
  onRetry,
  onSearchChange,
  pagination,
  pending = false,
  period,
  periodOptions,
  queue,
  renderLink,
  search = '',
}: Readonly<Dashboard3Props>) {
  const labels = { ...defaultDashboard3Labels, ...labelsProp }

  if (pending) {
    return (
      <Dashboard3Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const formatter = createDashboardFormatter({ currency, locale })
  const isEmpty =
    kpis.length === 0 &&
    crew.length === 0 &&
    queue.length === 0 &&
    forecast.length === 0

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-3"
    >
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        labels={labels}
        onExport={onExport}
        onPeriodChange={onPeriodChange}
        period={period}
        periodOptions={periodOptions}
        renderLink={renderLink}
        showExport={!error && !isEmpty}
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
          {kpis.length > 0 ? (
            <ul
              aria-label={labels.indicators}
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4"
            >
              {kpis.map((kpi) => (
                <li className="min-w-0" key={kpi.id}>
                  <DashboardKpiCard formatter={formatter} kpi={kpi} />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="grid items-start gap-4 xl:grid-cols-[2fr_1fr]">
            <DashboardPanel title={labels.forecastTitle}>
              <ChartFrame
                label={labels.forecastLabel}
                summary={labels.forecastSummary(
                  forecast.map((point) => ({
                    forecast: formatter.value(point.forecast),
                    label: point.label,
                    supply: formatter.value(point.supply),
                  })),
                )}
              >
                <ComposedChart
                  accessibilityLayer={false}
                  data={forecast}
                  margin={{ bottom: 0, left: 4, right: 8, top: 4 }}
                >
                  <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="label"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={(value) => formatter.value(Number(value))}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    content={(tooltip) => (
                      <ChartTooltip
                        {...tooltip}
                        formatValue={(value) => formatter.value(value)}
                      />
                    )}
                  />
                  <Area
                    dataKey="supply"
                    fill={supplyColor}
                    fillOpacity={0.25}
                    isAnimationActive={false}
                    name={labels.supplySeries}
                    stroke={supplyColor}
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    dataKey="forecast"
                    dot={false}
                    isAnimationActive={false}
                    name={labels.forecastSeries}
                    stroke={forecastColor}
                    strokeDasharray="5 4"
                    strokeWidth={2}
                    type="monotone"
                  />
                </ComposedChart>
              </ChartFrame>
              <ChartLegend
                items={[
                  { color: supplyColor, label: labels.supplySeries },
                  { color: forecastColor, label: labels.forecastSeries },
                ]}
              />
            </DashboardPanel>
            <DashboardPanel title={labels.queueTitle}>
              {queue.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {labels.noQueue}
                </p>
              ) : (
                <ul
                  aria-label={labels.queueTitle}
                  className="m-0 grid list-none gap-3 p-0"
                >
                  {queue.map((item) => (
                    <li
                      className="flex items-start justify-between gap-3"
                      data-queue-item={item.id}
                      key={item.id}
                    >
                      <div className="grid min-w-0 gap-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                          {item.priority ? (
                            <Badge variant={item.priority.tone ?? 'secondary'}>
                              {item.priority.label}
                            </Badge>
                          ) : null}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {item.description}
                        </span>
                      </div>
                      {onAction ? (
                        <Button
                          aria-label={labels.actionFor(
                            item.actionLabel ?? labels.action,
                            item.title,
                          )}
                          onClick={() => onAction(item.id)}
                          size="sm"
                          variant="outline"
                        >
                          {item.actionLabel ?? labels.action}
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </DashboardPanel>
          </div>
          <DashboardPanel
            action={
              onSearchChange ? (
                <DashboardSearch
                  label={labels.search}
                  onValueChange={onSearchChange}
                  value={search}
                />
              ) : undefined
            }
            title={labels.crewTitle}
          >
            <Table aria-label={labels.crewTitle}>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.columnMember}</TableHead>
                  <TableHead>{labels.columnShift}</TableHead>
                  <TableHead className="w-48">
                    {labels.columnCoverage}
                  </TableHead>
                  <TableHead>{labels.columnStatus}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crew.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center" colSpan={4}>
                      <span className="text-muted-foreground">
                        {labels.noCrew}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  crew.map((member) => (
                    <TableRow data-member={member.id} key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            {member.avatarSrc ? (
                              <AvatarImage alt="" src={member.avatarSrc} />
                            ) : null}
                            <AvatarFallback>
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.shift}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            aria-label={labels.coverageOf(member.name)}
                            max={1}
                            min={0}
                            value={member.coverage}
                          />
                          <span className="w-12 text-right text-xs tabular-nums">
                            {formatter.value(member.coverage, 'percent')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status.tone ?? 'secondary'}>
                          {member.status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {pagination && onPageChange ? (
              <DashboardPagination
                label={labels.pagination}
                nextLabel={labels.nextPage}
                onPageChange={onPageChange}
                page={pagination.page}
                pageCount={pagination.pageCount}
                pageOf={labels.pageOf}
                previousLabel={labels.previousPage}
              />
            ) : null}
          </DashboardPanel>
        </>
      )}
    </section>
  )
}
