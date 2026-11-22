import {
  AssetList,
  AssetListItem,
  AssetStatWidget,
  BalanceWidget,
  BudgetWidget,
  CashFlowWidget,
  formatAmount,
  IconFrame,
  InvoiceStatusWidget,
  MarketShareWidget,
  RiskScoreWidget,
  TransactionsWidget,
  TrendIndicator,
  type WidgetTone,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { BitcoinIcon, GemIcon, SparklesIcon, ZapIcon } from 'lucide-react'
import { type ReactElement, useState } from 'react'
import type { FinanceControls, FinanceTone } from './finance-controls.ts'
import {
  type BalancePeriod,
  type BudgetPeriod,
  balanceChange,
  balancePeriods,
  balanceSeries,
  brand,
  budgetCategories,
  budgetPeriods,
  type CashFlowPeriod,
  cashFlowPeriods,
  cashFlowSeries,
  invoiceStatuses,
  type MarketPeriod,
  marketPeriods,
  marketRange,
  marketSegments,
  transactions,
} from './finance-data.tsx'

interface PeriodOptions {
  periods?: boolean | undefined
  title?: string | undefined
}

interface ListOptions {
  action?: boolean | undefined
  empty?: boolean | undefined
  title?: string | undefined
  visibleCount?: number | undefined
}

const viewAll = (
  <Button size="sm" variant="ghost">
    View all
  </Button>
)

export function MarketLeaders({
  periods = true,
  title = 'Market Leaders',
}: Readonly<PeriodOptions>): ReactElement {
  const [period, setPeriod] = useState<MarketPeriod>('month')
  const [start, end] = marketRange[period]

  return (
    <MarketShareWidget
      endLabel={end}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Market period"
      periods={periods ? marketPeriods : []}
      segments={marketSegments[period]}
      startLabel={start}
      title={title}
    >
      <AssetList aria-label="Market leaders">
        <AssetListItem
          icon={
            <IconFrame color={brand.bitcoin} shape="rounded">
              <BitcoinIcon />
            </IconFrame>
          }
          meta={`24h: ${formatAmount(500, { signDisplay: 'always' })}`}
          name="Bitcoin"
          value={formatAmount(115485.04)}
        />
        <AssetListItem
          icon={
            <IconFrame color={brand.ethereum} shape="rounded">
              <GemIcon />
            </IconFrame>
          }
          meta={<TrendIndicator value={-0.0124} variant="plain" />}
          name="Ethereum"
          value={formatAmount(4510.64)}
        />
      </AssetList>
    </MarketShareWidget>
  )
}

export function TotalBalance({
  periods = true,
  title = 'Total balance',
}: Readonly<PeriodOptions>): ReactElement {
  const [period, setPeriod] = useState<BalancePeriod>('6m')
  const data = balanceSeries[period]
  const last = data.at(-1)?.value ?? 0

  return (
    <BalanceWidget
      change={balanceChange[period]}
      changeLabel="in the selected period"
      chartLabel={`Balance grew from ${formatAmount(data[0]?.value ?? 0)} to ${formatAmount(last)}`}
      data={data}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Balance period"
      periods={periods ? balancePeriods : []}
      title={title}
      value={last}
    />
  )
}

export function MonthlyBudget({
  action = false,
  empty = false,
  periods = true,
  title = 'Budget',
  visibleCount = 5,
}: Readonly<ListOptions & { periods?: boolean | undefined }>): ReactElement {
  const [period, setPeriod] = useState<BudgetPeriod>('month')

  return (
    <BudgetWidget
      action={action ? viewAll : undefined}
      categories={empty ? [] : budgetCategories[period]}
      expand={{ visibleCount }}
      limitLabel="Budget"
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Budget period"
      periods={periods ? budgetPeriods : []}
      spentLabel="Spent so far"
      title={title}
    />
  )
}

export function RecentTransactions({
  action = false,
  empty = false,
  title = 'Recent transactions',
  visibleCount = 5,
}: Readonly<ListOptions>): ReactElement {
  return (
    <TransactionsWidget
      action={action ? viewAll : undefined}
      collapseLabel="Show less"
      emptyLabel="No transactions this week"
      expandLabel={(hidden) => `See all (+${hidden})`}
      title={title}
      transactions={empty ? [] : transactions}
      visibleCount={visibleCount}
    />
  )
}

export function CashFlow({
  periods = true,
  title = 'Cash flow',
}: Readonly<PeriodOptions>): ReactElement {
  const [period, setPeriod] = useState<CashFlowPeriod>('quarter')

  return (
    <CashFlowWidget
      chartLabel="Income and expenses by month"
      data={cashFlowSeries[period]}
      expensesLabel="Expenses"
      incomeLabel="Income"
      netLabel="Net"
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Cash flow period"
      periods={periods ? cashFlowPeriods : []}
      title={title}
    />
  )
}

export function Receivables({
  action = false,
  empty = false,
  title = 'Invoices',
  visibleCount = 5,
}: Readonly<ListOptions>): ReactElement {
  return (
    <InvoiceStatusWidget
      action={
        action ? (
          <Button size="sm" variant="ghost">
            Send reminders
          </Button>
        ) : undefined
      }
      countLabel={(count) => `${count} invoices`}
      expand={{ visibleCount }}
      statuses={empty ? [] : invoiceStatuses}
      title={title}
      totalLabel="Billed this quarter"
    />
  )
}

export function RiskAnalysis({
  action = true,
  title = 'AI Risk Analysis',
  tone = 'success',
}: Readonly<{
  action?: boolean | undefined
  title?: string | undefined
  tone?: WidgetTone | undefined
}>): ReactElement {
  return (
    <RiskScoreWidget
      action={
        action ? (
          <Button size="sm" variant="ghost">
            <SparklesIcon aria-hidden="true" />
            Rebalance with AI
          </Button>
        ) : undefined
      }
      highLabel="High Risk"
      lowLabel="Low Risk"
      score={72}
      stats={[
        { id: 'score', label: 'Risk Score', value: '72/100' },
        { id: 'suggestion', label: 'AI Suggestion', value: '15% BTC → ETH' },
      ]}
      title={title}
      tone={tone}
    />
  )
}

export function ZcashReward({
  change = -0.0018,
  tone = 'default',
}: Readonly<{
  change?: number | undefined
  tone?: FinanceTone | undefined
}>): ReactElement {
  return (
    <AssetStatWidget
      change={change}
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      icon={
        <IconFrame color={brand.zcash} shape="rounded">
          <ZapIcon />
        </IconFrame>
      }
      label="Reward rate"
      name="Zcash"
      symbol="ZEC"
      tone={tone}
      value={0.0934}
    />
  )
}

export function StakingYield(): ReactElement {
  return (
    <AssetStatWidget
      change={0.0031}
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      icon={
        <IconFrame color={brand.ethereum} shape="rounded">
          <GemIcon />
        </IconFrame>
      }
      label="Staking yield"
      name="Ethereum"
      symbol="ETH"
      value={0.0412}
    />
  )
}

export function ComposedFinance({
  action,
  empty,
  periods,
  riskTone,
  title,
  tone,
  visibleCount,
  widget,
}: Readonly<FinanceControls>): ReactElement {
  const label = title || undefined

  if (widget === 'balance')
    return <TotalBalance periods={periods} title={label} />
  if (widget === 'budget')
    return (
      <MonthlyBudget
        action={action}
        empty={empty}
        periods={periods}
        title={label}
        visibleCount={visibleCount}
      />
    )
  if (widget === 'cash-flow')
    return <CashFlow periods={periods} title={label} />
  if (widget === 'transactions')
    return (
      <RecentTransactions
        action={action}
        empty={empty}
        title={label}
        visibleCount={visibleCount}
      />
    )
  if (widget === 'invoice-status')
    return (
      <Receivables
        action={action}
        empty={empty}
        title={label}
        visibleCount={visibleCount}
      />
    )
  if (widget === 'risk-score')
    return <RiskAnalysis action={action} title={label} tone={riskTone} />
  if (widget === 'asset-stat') return <ZcashReward tone={tone} />
  return <MarketLeaders periods={periods} title={label} />
}

export function MarketShareBar(): ReactElement {
  return (
    <MarketShareWidget segments={marketSegments.month} title="Market Leaders" />
  )
}

export function RiskScoreBare(): ReactElement {
  return (
    <RiskScoreWidget
      highLabel="High Risk"
      lowLabel="Low Risk"
      score={24}
      title="Risk score"
    />
  )
}

export function AssetStatWithoutTrend(): ReactElement {
  return (
    <AssetStatWidget
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      icon={
        <IconFrame color={brand.zcash} shape="rounded">
          <ZapIcon />
        </IconFrame>
      }
      label="Reward rate"
      name="Zcash"
      symbol="ZEC"
      value={0.0934}
    />
  )
}
