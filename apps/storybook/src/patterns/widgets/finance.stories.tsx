import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import {
  AssetList,
  AssetListItem,
  AssetStatWidget,
  type BalancePoint,
  BalanceWidget,
  type BudgetCategory,
  BudgetWidget,
  type CashFlowPoint,
  CashFlowWidget,
  formatAmount,
  IconFrame,
  InvoiceStatusWidget,
  type MarketShareSegment,
  MarketShareWidget,
  MetricWidget,
  RiskScoreWidget,
  type Transaction,
  TransactionsWidget,
  TrendIndicator,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  BitcoinIcon,
  BriefcaseIcon,
  CarIcon,
  CoffeeIcon,
  GemIcon,
  HouseIcon,
  ShoppingCartIcon,
  SparklesIcon,
  UtensilsIcon,
  ZapIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

type MarketPeriod = 'month' | 'week'
type BalancePeriod = '1m' | '6m' | '1y'

const brand = {
  bitcoin: '#f7931a',
  ethereum: '#627eea',
  zcash: '#a855f7',
}

const category = {
  coffee: '#b45309',
  dining: '#d97706',
  groceries: '#0d9488',
  housing: '#2563eb',
  salary: '#059669',
  transport: '#7c3aed',
}

const marketPeriods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

const marketSegments: Record<MarketPeriod, MarketShareSegment[]> = {
  month: [
    {
      change: 0.0044,
      color: brand.bitcoin,
      id: 'btc',
      label: 'Bitcoin',
      value: 66,
    },
    {
      change: 0.0056,
      color: '#7b91f0',
      id: 'eth',
      label: 'Ethereum',
      value: 20,
    },
    {
      change: 0.0102,
      color: 'var(--muted-foreground)',
      id: 'other',
      label: 'Others',
      value: 14,
    },
  ],
  week: [
    {
      change: -0.0021,
      color: brand.bitcoin,
      id: 'btc',
      label: 'Bitcoin',
      value: 61,
    },
    {
      change: 0.0113,
      color: '#7b91f0',
      id: 'eth',
      label: 'Ethereum',
      value: 25,
    },
    {
      change: 0.0038,
      color: 'var(--muted-foreground)',
      id: 'other',
      label: 'Others',
      value: 14,
    },
  ],
}

const marketRange: Record<MarketPeriod, [string, string]> = {
  month: ['1 May', '31 May'],
  week: ['25 May', '31 May'],
}

const balanceSeries: Record<BalancePeriod, BalancePoint[]> = {
  '1m': [
    { label: 'May 1', value: 45120 },
    { label: 'May 8', value: 46380 },
    { label: 'May 15', value: 45710 },
    { label: 'May 22', value: 47240 },
    { label: 'May 31', value: 48250.75 },
  ],
  '6m': [
    { label: 'Dec', value: 38200 },
    { label: 'Jan', value: 39950 },
    { label: 'Feb', value: 37810 },
    { label: 'Mar', value: 42400 },
    { label: 'Apr', value: 44890 },
    { label: 'May', value: 48250.75 },
  ],
  '1y': [
    { label: 'Jun', value: 29800 },
    { label: 'Aug', value: 31750 },
    { label: 'Oct', value: 30420 },
    { label: 'Dec', value: 38200 },
    { label: 'Feb', value: 37810 },
    { label: 'Apr', value: 44890 },
    { label: 'May', value: 48250.75 },
  ],
}

const balanceChange: Record<BalancePeriod, number> = {
  '1m': 0.0694,
  '6m': 0.2631,
  '1y': 0.6191,
}

function MarketLeaders() {
  const [period, setPeriod] = useState<MarketPeriod>('month')
  const [start, end] = marketRange[period]

  return (
    <MarketShareWidget
      endLabel={end}
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Market period"
      periods={marketPeriods}
      segments={marketSegments[period]}
      startLabel={start}
      title="Market Leaders"
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

function ZcashReward({ tone }: Readonly<{ tone?: 'default' | 'inverted' }>) {
  return (
    <AssetStatWidget
      change={-0.0018}
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      icon={
        <IconFrame color={brand.zcash} shape="rounded">
          <ZapIcon />
        </IconFrame>
      }
      label="Reward rate"
      name="Zcash"
      symbol="ZEC"
      {...(tone ? { tone } : {})}
      value={0.0934}
    />
  )
}

function RiskAnalysis() {
  return (
    <RiskScoreWidget
      action={
        <Button size="sm" variant="ghost">
          <SparklesIcon aria-hidden="true" />
          Rebalance with AI
        </Button>
      }
      highLabel="High Risk"
      lowLabel="Low Risk"
      score={72}
      stats={[
        { id: 'score', label: 'Risk Score', value: '72/100' },
        { id: 'suggestion', label: 'AI Suggestion', value: '15% BTC → ETH' },
      ]}
      title="AI Risk Analysis"
    />
  )
}

function TotalBalance() {
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
      periods={[
        { label: '1M', value: '1m' },
        { label: '6M', value: '6m' },
        { label: '1Y', value: '1y' },
      ]}
      title="Total balance"
      value={last}
    />
  )
}

// O tom invertido aplica o .dark do tema ao widget. No tema escuro deste
// Storybook, o muted-foreground sobre o card fica em 4,21:1 no texto pequeno;
// o contraste segue verificado no restante da story.
const invertedThemeContrast = {
  a11y: {
    config: {
      rules: [
        {
          id: 'color-contrast',
          selector: '*:not([data-tone="inverted"] *)',
        },
      ],
    },
  },
}

const meta = {
  title: 'Patterns/Widgets/Finance',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  parameters: invertedThemeContrast,
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
          <MarketLeaders />
          <TotalBalance />
        </div>
        <div className="grid content-start gap-4">
          <RiskAnalysis />
          <div className="grid gap-4 sm:grid-cols-2">
            <ZcashReward tone="inverted" />
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
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const market = canvas.getByRole('region', { name: 'Market Leaders' })
    await expect(market).toHaveTextContent('Bitcoin: 66.00%')
    await userEvent.click(within(market).getByRole('button', { name: 'Week' }))
    await expect(market).toHaveTextContent('Bitcoin: 61.00%')
    await expect(market).toHaveTextContent('25 May')
    await expect(
      canvas.getByRole('meter', { name: 'AI Risk Analysis' }),
    ).toHaveAttribute('aria-valuenow', '72')
  },
}

type BudgetPeriod = 'month' | 'week'
type CashFlowPeriod = 'quarter' | 'year'

const budgetCategories: Record<BudgetPeriod, BudgetCategory[]> = {
  month: [
    {
      color: category.housing,
      icon: <HouseIcon />,
      id: 'housing',
      label: 'Housing',
      limit: 1800,
      spent: 1800,
    },
    {
      color: category.groceries,
      icon: <ShoppingCartIcon />,
      id: 'groceries',
      label: 'Groceries',
      limit: 600,
      spent: 412.35,
    },
    {
      color: category.dining,
      icon: <UtensilsIcon />,
      id: 'dining',
      label: 'Dining out',
      limit: 250,
      spent: 318.4,
    },
    {
      color: category.transport,
      icon: <CarIcon />,
      id: 'transport',
      label: 'Transport',
      limit: 300,
      spent: 146.2,
    },
  ],
  week: [
    {
      color: category.groceries,
      icon: <ShoppingCartIcon />,
      id: 'groceries',
      label: 'Groceries',
      limit: 150,
      spent: 96.8,
    },
    {
      color: category.dining,
      icon: <UtensilsIcon />,
      id: 'dining',
      label: 'Dining out',
      limit: 60,
      spent: 74.5,
    },
    {
      color: category.transport,
      icon: <CarIcon />,
      id: 'transport',
      label: 'Transport',
      limit: 75,
      spent: 32,
    },
  ],
}

const transactions: Transaction[] = [
  {
    amount: 4850,
    icon: (
      <IconFrame shape="rounded" color={category.salary}>
        <BriefcaseIcon />
      </IconFrame>
    ),
    id: 'salary',
    meta: 'Salary · May 30',
    name: 'Northwind Labs',
    status: (
      <Badge size="sm" variant="success">
        Cleared
      </Badge>
    ),
  },
  {
    amount: -1800,
    icon: (
      <IconFrame shape="rounded" color={category.housing}>
        <HouseIcon />
      </IconFrame>
    ),
    id: 'rent',
    meta: 'Housing · May 31',
    name: 'Rent',
  },
  {
    amount: -86.4,
    icon: (
      <IconFrame shape="rounded" color={category.groceries}>
        <ShoppingCartIcon />
      </IconFrame>
    ),
    id: 'market',
    meta: 'Groceries · Jun 1',
    name: 'Whole Market',
  },
  {
    amount: -5.75,
    icon: (
      <IconFrame shape="rounded" color={category.coffee}>
        <CoffeeIcon />
      </IconFrame>
    ),
    id: 'coffee',
    meta: 'Dining out · Jun 2',
    name: 'Corner Coffee',
    status: (
      <Badge size="sm" variant="secondary">
        Pending
      </Badge>
    ),
  },
  {
    amount: -42.9,
    icon: (
      <IconFrame shape="rounded" color={category.transport}>
        <CarIcon />
      </IconFrame>
    ),
    id: 'fuel',
    meta: 'Transport · Jun 2',
    name: 'Shell Station',
  },
  {
    amount: -64.2,
    icon: (
      <IconFrame shape="rounded" color={category.dining}>
        <UtensilsIcon />
      </IconFrame>
    ),
    id: 'dinner',
    meta: 'Dining out · Jun 3',
    name: 'Osteria Nova',
  },
  {
    amount: 320.5,
    icon: (
      <IconFrame shape="rounded" color={category.salary}>
        <BriefcaseIcon />
      </IconFrame>
    ),
    id: 'freelance',
    meta: 'Freelance · Jun 4',
    name: 'Design sprint',
  },
  {
    amount: -129,
    icon: (
      <IconFrame shape="rounded" color={category.groceries}>
        <ShoppingCartIcon />
      </IconFrame>
    ),
    id: 'market-2',
    meta: 'Groceries · Jun 6',
    name: 'Farmers Market',
  },
  {
    amount: -18.5,
    icon: (
      <IconFrame shape="rounded" color={category.transport}>
        <CarIcon />
      </IconFrame>
    ),
    id: 'parking',
    meta: 'Transport · Jun 7',
    name: 'City Parking',
  },
  {
    amount: -210,
    icon: (
      <IconFrame shape="rounded" color={category.housing}>
        <HouseIcon />
      </IconFrame>
    ),
    id: 'utilities',
    meta: 'Housing · Jun 8',
    name: 'Utilities',
    status: (
      <Badge size="sm" variant="secondary">
        Pending
      </Badge>
    ),
  },
]

const cashFlowSeries: Record<CashFlowPeriod, CashFlowPoint[]> = {
  quarter: [
    { expenses: 38200, income: 52400, label: 'Mar' },
    { expenses: 41650, income: 48900, label: 'Apr' },
    { expenses: 36980, income: 57300, label: 'May' },
  ],
  year: [
    { expenses: 112400, income: 141200, label: 'Q1' },
    { expenses: 118900, income: 139600, label: 'Q2' },
    { expenses: 124300, income: 158750, label: 'Q3' },
    { expenses: 131050, income: 171900, label: 'Q4' },
  ],
}

function MonthlyBudget() {
  const [period, setPeriod] = useState<BudgetPeriod>('month')

  return (
    <BudgetWidget
      categories={budgetCategories[period]}
      limitLabel="Budget"
      onPeriodChange={setPeriod}
      period={period}
      periodLabel="Budget period"
      periods={[
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ]}
      spentLabel="Spent so far"
      title="Budget"
    />
  )
}

function RecentTransactions({
  items = transactions,
}: Readonly<{ items?: Transaction[] }>) {
  return (
    <TransactionsWidget
      collapseLabel="Show less"
      expandLabel={(hidden) => `See all (+${hidden})`}
      title="Recent transactions"
      transactions={items}
    />
  )
}

function CashFlow() {
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
      periods={[
        { label: 'Quarter', value: 'quarter' },
        { label: 'Year', value: 'year' },
      ]}
      title="Cash flow"
    />
  )
}

function Receivables() {
  return (
    <InvoiceStatusWidget
      action={
        <Button size="sm" variant="ghost">
          Send reminders
        </Button>
      }
      countLabel={(count) => `${count} invoices`}
      statuses={[
        { count: 18, id: 'paid', label: 'Paid', tone: 'success', value: 64200 },
        { count: 7, id: 'due', label: 'Due', tone: 'warning', value: 23850 },
        {
          count: 3,
          id: 'overdue',
          label: 'Overdue',
          tone: 'destructive',
          value: 9400,
        },
        { count: 4, id: 'draft', label: 'Draft', tone: 'info', value: 6100 },
      ]}
      title="Invoices"
      totalLabel="Billed this quarter"
    />
  )
}

const single =
  (width: string): Decorator =>
  (Story) => (
    <div className="grid min-h-screen place-items-center p-6">
      <div className={`w-full ${width}`}>
        <Story />
      </div>
    </div>
  )

export const MarketShare: Story = {
  decorators: [single('max-w-md')],
  render: () => <MarketLeaders />,
}

export const Balance: Story = {
  decorators: [single('max-w-md')],
  render: () => <TotalBalance />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widget = canvas.getByRole('region', { name: 'Total balance' })
    await expect(widget).toHaveTextContent('26.31%')
    await userEvent.click(within(widget).getByRole('button', { name: '1Y' }))
    await expect(widget).toHaveTextContent('61.91%')
  },
}

export const RiskScore: Story = {
  decorators: [single('max-w-md')],
  render: () => <RiskAnalysis />,
}

export const RiskScoreTones: Story = {
  decorators: [single('max-w-md')],
  render: () => (
    <div className="grid gap-4">
      {(['success', 'warning', 'destructive', 'info'] as const).map(
        (tone, index) => (
          <RiskScoreWidget
            highLabel="High"
            key={tone}
            lowLabel="Low"
            score={[24, 58, 86, 40][index] ?? 0}
            title={`Tone ${tone}`}
            tone={tone}
          />
        ),
      )}
    </div>
  ),
}

export const PersonalOverview: Story = {
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="grid content-start gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricWidget
              change={0.0412}
              changeLabel="vs. last month"
              label="Net worth"
              value={128450.3}
            />
            <MetricWidget
              change={-0.018}
              changeLabel="vs. last month"
              label="Monthly spend"
              value={2677.1}
            />
          </div>
          <MonthlyBudget />
        </div>
        <RecentTransactions />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const budget = canvas.getByRole('region', { name: 'Budget' })
    await expect(budget).toHaveTextContent('$2,676.95')
    await userEvent.click(within(budget).getByRole('button', { name: 'Week' }))
    await expect(budget).toHaveTextContent('$203.30')
    await expect(
      canvas.getByRole('list', { name: 'Recent transactions' }),
    ).toHaveTextContent('+$4,850.00')
  },
}

export const BusinessOverview: Story = {
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
          <CashFlow />
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricWidget
              change={0.126}
              changeLabel="vs. last quarter"
              label="Revenue"
              value={158750}
            />
            <MetricWidget
              change={0.034}
              changeLabel="vs. last quarter"
              label="Gross margin"
              format={{ style: 'percent' }}
              value={0.612}
            />
          </div>
        </div>
        <div className="grid content-start gap-4">
          <Receivables />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cashFlow = canvas.getByRole('region', { name: 'Cash flow' })
    await expect(cashFlow).toHaveTextContent('$158,600.00')
    await userEvent.click(
      within(cashFlow).getByRole('button', { name: 'Year' }),
    )
    await expect(cashFlow).toHaveTextContent('$611,450.00')
    await expect(
      canvas.getByRole('region', { name: 'Invoices' }),
    ).toHaveTextContent('Paid: 62.00%')
  },
}

export const Budget: Story = {
  decorators: [single('max-w-md')],
  render: () => <MonthlyBudget />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('meter', { name: 'Dining out' }),
    ).toHaveAttribute('aria-valuenow', '250')
  },
}

export const Transactions: Story = {
  decorators: [single('max-w-md')],
  render: () => <RecentTransactions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Recent transactions' })
    await expect(within(region).getAllByRole('listitem')).toHaveLength(5)
    await userEvent.click(
      within(region).getByRole('button', { name: 'See all (+5)' }),
    )
    await expect(within(region).getAllByRole('listitem')).toHaveLength(10)
    await expect(region).toHaveTextContent('Utilities')
    await userEvent.click(
      within(region).getByRole('button', { name: 'Show less' }),
    )
    await expect(within(region).getAllByRole('listitem')).toHaveLength(5)
  },
}

export const TransactionsEmpty: Story = {
  decorators: [single('max-w-md')],
  render: () => (
    <TransactionsWidget
      emptyLabel="No transactions this week"
      title="Recent transactions"
      transactions={[]}
    />
  ),
}

export const CashFlowChart: Story = {
  decorators: [single('max-w-md')],
  render: () => <CashFlow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', { name: 'Income and expenses by month' }),
    ).toBeInTheDocument()
  },
}

export const InvoiceStatus: Story = {
  decorators: [single('max-w-md')],
  render: () => <Receivables />,
}

export const AssetStat: Story = {
  decorators: [single('max-w-xs')],
  render: () => <ZcashReward />,
}

export const AssetStatInverted: Story = {
  parameters: invertedThemeContrast,
  decorators: [single('max-w-xs')],
  render: () => <ZcashReward tone="inverted" />,
}
