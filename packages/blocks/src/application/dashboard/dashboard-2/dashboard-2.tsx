import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartFrame } from '../shared/chart-frame'
import { ChartLegend, ChartTooltip, chartColor } from '../shared/chart-tooltip'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardKpiCard } from '../shared/dashboard-kpi-card'
import { DashboardPanel } from '../shared/dashboard-panel'
import { createDashboardFormatter } from '../shared/format'
import { Dashboard2Skeleton } from './dashboard-2-skeleton'
import { defaultDashboard2Labels } from './labels'
import type { Dashboard2Props, Dashboard2SortKey } from './types'

export function Dashboard2({
  channels,
  className,
  currency,
  error = false,
  kpis,
  labels: labelsProp,
  locale,
  onRetry,
  onSortChange,
  orders,
  pending = false,
  sales,
  sort,
}: Readonly<Dashboard2Props>) {
  const labels = { ...defaultDashboard2Labels, ...labelsProp }

  if (pending) {
    return (
      <Dashboard2Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const formatter = createDashboardFormatter({ currency, locale })
  const isEmpty = kpis.length === 0 && sales.length === 0 && orders.length === 0
  const chartData = sales.map((point) => ({
    label: point.label,
    ...point.values,
  }))
  const ariaSort = (key: Dashboard2SortKey) =>
    sort.key === key
      ? sort.direction === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none'
  const sortHead = (key: Dashboard2SortKey, label: string, right = false) => (
    <TableHead
      aria-sort={ariaSort(key)}
      className={right ? 'text-right' : undefined}
    >
      <SortButton
        active={sort.key === key}
        direction={sort.direction}
        label={labels.sortBy(label)}
        onClick={() => changeSort(key)}
      >
        {label}
      </SortButton>
    </TableHead>
  )
  const changeSort = (key: Dashboard2SortKey) =>
    onSortChange({
      direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
      key,
    })

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-2"
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
          <DashboardPanel title={labels.salesTitle}>
            <ChartFrame
              label={labels.salesLabel}
              summary={labels.salesSummary(
                sales.map((point) => ({
                  label: point.label,
                  total: formatter.value(
                    channels.reduce(
                      (sum, channel) => sum + (point.values[channel.id] ?? 0),
                      0,
                    ),
                    'currency',
                  ),
                })),
              )}
            >
              <BarChart
                accessibilityLayer={false}
                data={chartData}
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
                  tickFormatter={(value) =>
                    formatter.value(Number(value), 'currency')
                  }
                  tickLine={false}
                  width={72}
                />
                <Tooltip
                  content={(tooltip) => (
                    <ChartTooltip
                      {...tooltip}
                      formatValue={(value) =>
                        formatter.value(value, 'currency')
                      }
                    />
                  )}
                  cursor={{ fill: 'var(--muted)' }}
                />
                {channels.map((channel, index) => (
                  <Bar
                    dataKey={channel.id}
                    fill={chartColor(index)}
                    isAnimationActive={false}
                    key={channel.id}
                    name={channel.label}
                    radius={index === channels.length - 1 ? [4, 4, 0, 0] : 0}
                    stackId="sales"
                  />
                ))}
              </BarChart>
            </ChartFrame>
            <ChartLegend
              items={channels.map((channel, index) => ({
                color: chartColor(index),
                label: channel.label,
              }))}
            />
          </DashboardPanel>
          <DashboardPanel title={labels.ordersTitle}>
            <Table aria-label={labels.ordersTitle}>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.columnOrder}</TableHead>
                  {sortHead('customer', labels.columnCustomer)}
                  <TableHead>{labels.columnStatus}</TableHead>
                  {sortHead('placedAt', labels.columnPlacedAt)}
                  {sortHead('total', labels.columnTotal, true)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center" colSpan={5}>
                      <span className="text-muted-foreground">
                        {labels.noOrders}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow data-order={order.id} key={order.id}>
                      <TableCell className="font-medium">
                        {order.number}
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant={order.status.tone ?? 'secondary'}>
                          {order.status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {order.placedAt}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatter.currency(order.total)}
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

function SortButton({
  active,
  children,
  direction,
  label,
  onClick,
}: Readonly<{
  active: boolean
  children: string
  direction: 'asc' | 'desc'
  label: string
  onClick: () => void
}>) {
  const Icon = direction === 'asc' ? ArrowUpIcon : ArrowDownIcon

  return (
    <Button
      aria-label={label}
      className="-ms-2.5"
      onClick={onClick}
      size="sm"
      variant="ghost"
    >
      {children}
      {active ? <Icon aria-hidden="true" /> : null}
    </Button>
  )
}
