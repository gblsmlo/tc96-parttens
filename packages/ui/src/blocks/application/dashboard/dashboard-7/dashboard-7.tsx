import { Badge } from '@tc96/ui/badge'
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
import { ChartSeriesLegend } from '../shared/chart-series-legend'
import { DashboardError } from '../shared/dashboard-error'
import { DashboardFilter } from '../shared/dashboard-filter'
import { DashboardHeader } from '../shared/dashboard-header'
import { DashboardLink } from '../shared/dashboard-link'
import { DashboardLinkList } from '../shared/dashboard-link-list'
import {
  DashboardMetricCard,
  type DashboardMetricCardProps,
} from '../shared/dashboard-metric-card'
import { DashboardPagination } from '../shared/dashboard-pagination'
import { DashboardPanel } from '../shared/dashboard-panel'
import { createDateFormatter } from '../shared/format-date'
import { createMoneyFormatter } from '../shared/format-money'
import { PeriodColumnChart } from '../shared/period-column-chart'
import { Dashboard7CashFlowGrid } from './dashboard-7-cash-flow-grid'
import { Dashboard7Skeleton } from './dashboard-7-skeleton'
import { defaultDashboard7Labels } from './labels'
import type { Dashboard7CategoryKind, Dashboard7Props } from './types'

const inflowColor = 'var(--chart-1)'
const outflowColor = 'var(--chart-2)'
const flowSeries = [
  { color: inflowColor, id: 'inflow' },
  { color: outflowColor, id: 'outflow' },
]
const categoryKinds: Dashboard7CategoryKind[] = ['income', 'expense']

export function Dashboard7({
  account,
  accountBalances,
  accountOptions,
  balances,
  breadcrumbs,
  cashFlow,
  cashFlowGrid,
  cashFlowTotals,
  categoryKind = 'income',
  className,
  clientMoney,
  clientMoneyPagination,
  currency,
  dueSoon,
  error = false,
  expenseByCategory,
  incomeByCategory,
  indicators = {},
  labels: labelsProp,
  locale,
  onAccountChange,
  onCategoryKindChange,
  onCellSelect,
  onClientMoneyPageChange,
  onPeriodChange,
  onRetry,
  pending = false,
  period,
  periodOptions,
  receivables,
  renderLink = renderAnchor,
  timeZone,
}: Readonly<Dashboard7Props>) {
  const labels = { ...defaultDashboard7Labels, ...labelsProp }

  if (pending) {
    return (
      <Dashboard7Skeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const numbers = createMoneyFormatter({ currency, locale })
  const dates = createDateFormatter({ locale, timeZone })
  const categories =
    categoryKind === 'income' ? incomeByCategory : expenseByCategory

  const balanceCards: DashboardMetricCardProps[] = balances
    ? [
        {
          description: labels.realizedHelp,
          detail: balances.scope,
          id: 'realized',
          label: labels.realizedBalance,
          tone: balances.realizedCents < 0 ? 'negative' : 'neutral',
          value: numbers.cents(balances.realizedCents),
        },
        ...balances.projections.map((projection) => ({
          description: labels.projectedHelp,
          detail: balances.scope,
          id: `projected-${projection.date}`,
          label: labels.projectedBalance(dates.fullDate(projection.date)),
          tone:
            projection.cents < 0 ? ('negative' as const) : ('neutral' as const),
          value: numbers.cents(projection.cents),
        })),
      ]
    : []

  const indicatorCards: DashboardMetricCardProps[] = []
  if (indicators.delinquency) {
    indicatorCards.push({
      description: labels.delinquencyHelp,
      detail: indicators.delinquency.detail,
      id: 'delinquency',
      label: labels.delinquencyLabel,
      value:
        indicators.delinquency.ratio === null
          ? labels.noData
          : numbers.percent(indicators.delinquency.ratio),
    })
  }
  if (indicators.collectionDays) {
    const { days } = indicators.collectionDays
    indicatorCards.push({
      description: labels.collectionDaysHelp,
      detail: indicators.collectionDays.detail,
      id: 'collection-days',
      label: labels.collectionDaysLabel,
      value:
        days === null ? labels.noData : labels.days(days, numbers.count(days)),
    })
  }
  if (indicators.cashMargin) {
    const { ratio } = indicators.cashMargin
    indicatorCards.push({
      description: labels.cashMarginHelp,
      detail: indicators.cashMargin.detail,
      id: 'cash-margin',
      label: labels.cashMarginLabel,
      tone: ratio !== null && ratio < 0 ? 'negative' : 'neutral',
      value: ratio === null ? labels.noData : numbers.percent(ratio),
    })
  }
  if (indicators.runway) {
    indicatorCards.push({
      description: labels.runwayHelp,
      detail: indicators.runway.detail,
      id: 'runway',
      label: labels.runwayLabel,
      value: indicators.runway.text ?? labels.noData,
    })
  }

  const flowData = cashFlow.flatMap((month) => {
    const period = dates.month(month.month)
    const forecast = month.column === 'forecast'
    return [
      { forecast, period, series: 'inflow', value: month.inflowCents },
      { forecast, period, series: 'outflow', value: month.outflowCents },
    ]
  })
  const seriesLabel = (series: string) =>
    series === 'inflow' ? labels.inflowSeries : labels.outflowSeries

  const isEmpty =
    balances === undefined &&
    indicatorCards.length === 0 &&
    cashFlow.length === 0 &&
    receivables === undefined &&
    incomeByCategory.length === 0 &&
    expenseByCategory.length === 0 &&
    dueSoon.length === 0 &&
    (accountBalances ?? []).length === 0 &&
    (clientMoney ?? []).length === 0 &&
    (cashFlowGrid?.months ?? []).length === 0

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-block="dashboard-7"
    >
      <DashboardHeader
        breadcrumbs={breadcrumbs}
        labels={labels}
        onPeriodChange={onPeriodChange}
        period={period}
        periodOptions={periodOptions}
        renderLink={renderLink}
      />
      {onAccountChange && account !== undefined && accountOptions?.length ? (
        <DashboardFilter
          label={labels.account}
          onValueChange={onAccountChange}
          options={accountOptions}
          value={account}
        />
      ) : null}
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
          {balanceCards.length > 0 ? (
            <ul
              aria-label={labels.balancesTitle}
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4"
            >
              {balanceCards.map((card) => (
                <li className="min-w-0" key={card.id}>
                  <DashboardMetricCard {...card} />
                </li>
              ))}
            </ul>
          ) : null}
          {indicatorCards.length > 0 ? (
            <ul
              aria-label={labels.indicatorsTitle}
              className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4"
            >
              {indicatorCards.map((card) => (
                <li className="min-w-0" key={card.id}>
                  <DashboardMetricCard {...card} />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="grid items-start gap-4 xl:grid-cols-[3fr_2fr]">
            <DashboardPanel title={labels.cashFlowTitle}>
              {cashFlow.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {labels.cashFlowEmpty}
                </p>
              ) : (
                <>
                  {cashFlowTotals ? (
                    <dl className="m-0 grid grid-cols-3 gap-3">
                      <div className="grid gap-0.5" data-total="inflow">
                        <dt className="text-muted-foreground text-xs">
                          {labels.inflowSeries}
                        </dt>
                        <dd className="m-0 font-semibold tabular-nums">
                          {numbers.cents(cashFlowTotals.inflowCents)}
                        </dd>
                      </div>
                      <div className="grid gap-0.5" data-total="outflow">
                        <dt className="text-muted-foreground text-xs">
                          {labels.outflowSeries}
                        </dt>
                        <dd className="m-0 font-semibold tabular-nums">
                          {numbers.cents(cashFlowTotals.outflowCents)}
                        </dd>
                      </div>
                      <div className="grid gap-0.5" data-total="result">
                        <dt className="text-muted-foreground text-xs">
                          {labels.resultLabel}
                        </dt>
                        <dd
                          className={cn(
                            'm-0 font-semibold tabular-nums',
                            cashFlowTotals.resultCents < 0 &&
                              'text-destructive-foreground',
                          )}
                        >
                          {numbers.cents(cashFlowTotals.resultCents)}
                        </dd>
                      </div>
                    </dl>
                  ) : null}
                  <PeriodColumnChart
                    columnTooltip={(datum) =>
                      labels.cashFlowTooltip(
                        datum.period,
                        seriesLabel(datum.series),
                        numbers.cents(datum.value),
                        datum.forecast === true,
                      )
                    }
                    data={flowData}
                    formatAxis={(value) => numbers.compactCents(value)}
                    label={labels.cashFlowLabel}
                    periods={cashFlow.map((month) => dates.month(month.month))}
                    series={flowSeries}
                    summary={labels.cashFlowSummary(
                      cashFlow.map((month) => ({
                        forecast: month.column === 'forecast',
                        inflow: numbers.cents(month.inflowCents),
                        month: dates.month(month.month),
                        outflow: numbers.cents(month.outflowCents),
                      })),
                    )}
                  />
                  <ChartSeriesLegend
                    items={[
                      {
                        color: inflowColor,
                        id: 'inflow',
                        label: labels.inflowSeries,
                      },
                      {
                        color: outflowColor,
                        id: 'outflow',
                        label: labels.outflowSeries,
                      },
                      {
                        color: 'var(--muted-foreground)',
                        id: 'forecast',
                        label: labels.forecastSeries,
                        marker: 'dashed',
                      },
                    ]}
                    label={labels.seriesLegend}
                  />
                </>
              )}
            </DashboardPanel>
            {receivables ? (
              <DashboardPanel title={labels.receivablesTitle}>
                <div className="grid gap-0.5">
                  <span className="text-muted-foreground text-xs">
                    {labels.receivablesTotal}
                  </span>
                  <span
                    className="font-semibold text-xl tabular-nums"
                    data-slot="dashboard-receivables-total"
                  >
                    {numbers.cents(receivables.totalCents)}
                  </span>
                </div>
                <CategoryBarChart
                  color="var(--chart-3)"
                  data={[
                    {
                      id: 'open',
                      label: labels.receivablesStates.open,
                      value: receivables.openCents,
                    },
                    {
                      id: 'overdue',
                      label: labels.receivablesStates.overdue,
                      value: receivables.overdueCents,
                    },
                    {
                      id: 'received',
                      label: labels.receivablesStates.received,
                      value: receivables.receivedCents,
                    },
                  ]}
                  formatValue={numbers.compactCents}
                  label={labels.receivablesLabel}
                  summary={labels.receivablesSummary([
                    {
                      label: labels.receivablesStates.open,
                      value: numbers.cents(receivables.openCents),
                    },
                    {
                      label: labels.receivablesStates.overdue,
                      value: numbers.cents(receivables.overdueCents),
                    },
                    {
                      label: labels.receivablesStates.received,
                      value: numbers.cents(receivables.receivedCents),
                    },
                  ])}
                  tooltipText={(datum) =>
                    labels.receivablesTooltip(
                      datum.label,
                      numbers.cents(datum.value),
                    )
                  }
                />
              </DashboardPanel>
            ) : null}
          </div>
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <DashboardPanel
              action={
                onCategoryKindChange ? (
                  <DashboardFilter
                    label={labels.categoryKind}
                    onValueChange={(next) => {
                      const kind = categoryKinds.find((item) => item === next)
                      if (kind) onCategoryKindChange(kind)
                    }}
                    options={categoryKinds.map((kind) => ({
                      label: labels.categoryKinds[kind],
                      value: kind,
                    }))}
                    value={categoryKind}
                  />
                ) : undefined
              }
              title={labels.categoriesTitle}
            >
              {categories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {labels.categoriesEmpty[categoryKind]}
                </p>
              ) : (
                <CategoryBarChart
                  color={categoryKind === 'income' ? inflowColor : outflowColor}
                  data={categories.map((category) => ({
                    id: category.id,
                    label: category.name,
                    value: category.cents,
                  }))}
                  formatValue={numbers.compactCents}
                  label={labels.categoriesLabel[categoryKind]}
                  summary={labels.categoriesSummary(
                    categories.map((category) => ({
                      label: category.name,
                      value: numbers.cents(category.cents),
                    })),
                  )}
                  tooltipText={(datum) =>
                    labels.categoryTooltip(
                      datum.label,
                      numbers.cents(datum.value),
                      numbers.percent(
                        categories.find((category) => category.id === datum.id)
                          ?.share ?? 0,
                      ),
                    )
                  }
                />
              )}
            </DashboardPanel>
            <DashboardPanel title={labels.dueSoonTitle}>
              <DashboardLinkList
                empty={labels.dueSoonEmpty}
                items={dueSoon.map((entry) => ({
                  description: labels.entryMeta(
                    entry.kind,
                    dates.fullDate(entry.dueDate),
                  ),
                  href: entry.href,
                  id: entry.id,
                  title: entry.description,
                  trailing: (
                    <>
                      <span
                        className={cn(
                          'font-medium text-sm tabular-nums',
                          entry.amountCents < 0 &&
                            'text-destructive-foreground',
                        )}
                      >
                        {numbers.cents(entry.amountCents)}
                      </span>
                      <Badge variant={entry.status.tone ?? 'secondary'}>
                        {entry.status.label}
                      </Badge>
                    </>
                  ),
                }))}
                label={labels.dueSoonTitle}
                renderLink={renderLink}
              />
            </DashboardPanel>
            {accountBalances ? (
              <DashboardPanel title={labels.accountsTitle}>
                <DashboardLinkList
                  empty={labels.accountsEmpty}
                  items={accountBalances.map((balance) => ({
                    href: balance.href,
                    id: balance.id,
                    title: balance.name,
                    trailing: (
                      <span
                        className={cn(
                          'font-medium text-sm tabular-nums',
                          balance.cents < 0 && 'text-destructive-foreground',
                        )}
                      >
                        {numbers.cents(balance.cents)}
                      </span>
                    ),
                  }))}
                  label={labels.accountsTitle}
                  renderLink={renderLink}
                />
              </DashboardPanel>
            ) : null}
            {clientMoney ? (
              <DashboardPanel title={labels.clientMoneyTitle}>
                <Table aria-label={labels.clientMoneyTitle}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{labels.columnClient}</TableHead>
                      <TableHead className="text-right">
                        {labels.columnBalance}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientMoney.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-center" colSpan={2}>
                          <span className="text-muted-foreground">
                            {labels.clientMoneyEmpty}
                          </span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      clientMoney.map((client) => (
                        <TableRow data-client={client.id} key={client.id}>
                          <TableCell>
                            {client.href ? (
                              <DashboardLink
                                className="font-medium hover:underline"
                                href={client.href}
                                renderLink={renderLink}
                              >
                                {client.name}
                              </DashboardLink>
                            ) : (
                              <span className="font-medium">{client.name}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {numbers.cents(client.heldCents)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {clientMoneyPagination && onClientMoneyPageChange ? (
                  <DashboardPagination
                    label={labels.pagination}
                    nextLabel={labels.nextPage}
                    onPageChange={onClientMoneyPageChange}
                    page={clientMoneyPagination.page}
                    pageCount={clientMoneyPagination.pageCount}
                    pageOf={labels.pageOf}
                    previousLabel={labels.previousPage}
                  />
                ) : null}
              </DashboardPanel>
            ) : null}
          </div>
          {cashFlowGrid ? (
            <DashboardPanel title={labels.gridTitle}>
              <Dashboard7CashFlowGrid
                dates={dates}
                grid={cashFlowGrid}
                labels={labels}
                numbers={numbers}
                onCellSelect={onCellSelect}
              />
            </DashboardPanel>
          ) : null}
        </>
      )}
    </section>
  )
}
