import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Badge } from '@tc96/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { cn } from '@tc96/utils'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartFrame } from '../shared/chart-frame'
import { ChartLegend, ChartTooltip } from '../shared/chart-tooltip'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardKpiCard } from '../shared/dashboard-kpi-card'
import { DashboardPanel } from '../shared/dashboard-panel'
import { createDashboardFormatter } from '../shared/format'
import { Dashboard1Skeleton } from './dashboard-1-skeleton'
import { defaultDashboard1Labels } from './labels'
import type { Dashboard1Props } from './types'

const usedColor = 'var(--chart-1)'
const totalColor = 'var(--chart-2)'

export function Dashboard1({
  capacity,
  className,
  currency,
  error = false,
  exceptions,
  filter,
  filterOptions,
  kpis,
  labels: labelsProp,
  locale,
  onFilterChange,
  onRetry,
  pending = false,
}: Readonly<Dashboard1Props>) {
  const labels = { ...defaultDashboard1Labels, ...labelsProp }

  if (pending) {
    return (
      <Dashboard1Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const formatter = createDashboardFormatter({ currency, locale })
  const isEmpty =
    kpis.length === 0 && capacity.length === 0 && exceptions.length === 0

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-1"
    >
      <h2 className="font-semibold text-lg">{labels.title}</h2>
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
          <DashboardPanel title={labels.capacityTitle}>
            <ChartFrame
              label={labels.capacityLabel}
              summary={labels.capacitySummary(
                capacity.map((point) => ({
                  capacity: formatter.value(point.capacity),
                  label: point.label,
                  used: formatter.value(point.used),
                })),
              )}
            >
              <BarChart
                accessibilityLayer={false}
                barGap={4}
                data={capacity}
                margin={{ bottom: 0, left: 4, right: 4, top: 4 }}
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
                  width={48}
                />
                <Tooltip
                  content={(tooltip) => (
                    <ChartTooltip
                      {...tooltip}
                      formatValue={(value) => formatter.value(value)}
                    />
                  )}
                  cursor={{ fill: 'var(--muted)' }}
                />
                <Bar
                  dataKey="used"
                  fill={usedColor}
                  isAnimationActive={false}
                  name={labels.capacityUsed}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="capacity"
                  fill={totalColor}
                  isAnimationActive={false}
                  name={labels.capacityTotal}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartFrame>
            <ChartLegend
              items={[
                { color: usedColor, label: labels.capacityUsed },
                { color: totalColor, label: labels.capacityTotal },
              ]}
            />
          </DashboardPanel>
          <DashboardPanel
            action={
              <ToggleGroup
                aria-label={labels.filter}
                onValueChange={(next) => {
                  const [value] = next as string[]
                  if (value !== undefined) onFilterChange(value)
                }}
                size="sm"
                value={[filter]}
              >
                {filterOptions.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            }
            title={labels.exceptionsTitle}
          >
            <Table aria-label={labels.exceptionsTitle}>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.columnOrder}</TableHead>
                  <TableHead>{labels.columnHub}</TableHead>
                  <TableHead>{labels.columnReason}</TableHead>
                  <TableHead className="text-right">
                    {labels.columnDelay}
                  </TableHead>
                  <TableHead>{labels.columnStatus}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exceptions.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center" colSpan={5}>
                      <span className="text-muted-foreground">
                        {labels.noExceptions}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  exceptions.map((exception) => (
                    <TableRow data-exception={exception.id} key={exception.id}>
                      <TableCell className="font-medium">
                        {exception.order}
                      </TableCell>
                      <TableCell>{exception.hub}</TableCell>
                      <TableCell>{exception.reason}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {labels.delay(formatter.value(exception.delayHours))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={exception.status.tone ?? 'secondary'}>
                          {exception.status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </DashboardPanel>
        </>
      )}
    </section>
  )
}
