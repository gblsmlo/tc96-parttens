import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
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
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame } from '../shared/chart-frame'
import { ChartLegend, ChartTooltip, chartColor } from '../shared/chart-tooltip'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardHeader } from '../shared/dashboard-header'
import { DashboardKpiCard } from '../shared/dashboard-kpi-card'
import { DashboardPagination } from '../shared/dashboard-pagination'
import { DashboardPanel } from '../shared/dashboard-panel'
import { DashboardRowActions } from '../shared/dashboard-row-actions'
import { DashboardSearch } from '../shared/dashboard-search'
import { createDashboardFormatter } from '../shared/format'
import { Dashboard2Skeleton } from './dashboard-2-skeleton'
import { defaultDashboard2Labels } from './labels'
import type { Dashboard2Props, Dashboard2SortKey } from './types'

const planColor = 'var(--muted-foreground)'

export function Dashboard2({
  breadcrumbs,
  channels,
  className,
  currency,
  error = false,
  kpis,
  labels: labelsProp,
  locale,
  onExport,
  onPageChange,
  onPeriodChange,
  onRetry,
  onRowAction,
  onSearchChange,
  onSortChange,
  orders,
  pagination,
  pending = false,
  period,
  periodOptions,
  renderLink,
  rowActions,
  sales,
  search = '',
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
  const hasPlan = sales.some((point) => point.plan !== undefined)
  const hasRowActions = Boolean(onRowAction && rowActions?.length)
  const columnCount = hasRowActions ? 6 : 5
  const chartData = sales.map((point) => ({
    label: point.label,
    plan: point.plan,
    ...point.values,
  }))
  const mix = channels.map((channel) => ({
    id: channel.id,
    label: channel.label,
    total: sales.reduce(
      (sum, point) => sum + (point.values[channel.id] ?? 0),
      0,
    ),
  }))
  const ariaSort = (key: Dashboard2SortKey) =>
    sort.key === key
      ? sort.direction === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none'
  const changeSort = (key: Dashboard2SortKey) =>
    onSortChange({
      direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
      key,
    })
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

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-2"
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
          <div className="grid items-start gap-4 xl:grid-cols-[2fr_1fr]">
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
                <ComposedChart
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
                  />
                  {channels.map((channel, index) => (
                    <Area
                      dataKey={channel.id}
                      fill={chartColor(index)}
                      fillOpacity={0.35}
                      isAnimationActive={false}
                      key={channel.id}
                      name={channel.label}
                      stackId="sales"
                      stroke={chartColor(index)}
                      strokeWidth={1.5}
                      type="monotone"
                    />
                  ))}
                  {hasPlan ? (
                    <Line
                      dataKey="plan"
                      dot={false}
                      isAnimationActive={false}
                      name={labels.planSeries}
                      stroke={planColor}
                      strokeDasharray="5 4"
                      strokeWidth={1.5}
                      type="monotone"
                    />
                  ) : null}
                </ComposedChart>
              </ChartFrame>
              <ChartLegend
                items={[
                  ...channels.map((channel, index) => ({
                    color: chartColor(index),
                    label: channel.label,
                  })),
                  ...(hasPlan
                    ? [{ color: planColor, label: labels.planSeries }]
                    : []),
                ]}
              />
            </DashboardPanel>
            <DashboardPanel title={labels.mixTitle}>
              <ChartFrame
                label={labels.mixLabel}
                summary={labels.mixSummary(
                  mix.map((item) => ({
                    label: item.label,
                    total: formatter.value(item.total, 'currency'),
                  })),
                )}
              >
                <BarChart
                  accessibilityLayer={false}
                  data={mix}
                  layout="vertical"
                  margin={{ bottom: 0, left: 4, right: 12, top: 4 }}
                >
                  <XAxis hide type="number" />
                  <YAxis
                    axisLine={false}
                    dataKey="label"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickLine={false}
                    type="category"
                    width={88}
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
                  <Bar
                    dataKey="total"
                    isAnimationActive={false}
                    name={labels.mixTitle}
                    radius={[0, 4, 4, 0]}
                  >
                    {mix.map((item, index) => (
                      <Cell fill={chartColor(index)} key={item.id} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartFrame>
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
            title={labels.ordersTitle}
          >
            <Table aria-label={labels.ordersTitle}>
              <TableHeader>
                <TableRow>
                  <TableHead>{labels.columnOrder}</TableHead>
                  {sortHead('customer', labels.columnCustomer)}
                  <TableHead>{labels.columnStatus}</TableHead>
                  {sortHead('placedAt', labels.columnPlacedAt)}
                  {sortHead('total', labels.columnTotal, true)}
                  {hasRowActions ? (
                    <TableHead className="w-10">
                      <span className="sr-only">{labels.columnActions}</span>
                    </TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center" colSpan={columnCount}>
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
                      {hasRowActions && rowActions && onRowAction ? (
                        <TableCell className="text-right">
                          <DashboardRowActions
                            actions={rowActions}
                            label={labels.rowActionsFor(order.number)}
                            onAction={(actionId) =>
                              onRowAction(actionId, order.id)
                            }
                          />
                        </TableCell>
                      ) : null}
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
