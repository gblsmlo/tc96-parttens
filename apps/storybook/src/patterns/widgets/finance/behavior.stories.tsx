import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  AssetList,
  AssetListItem,
  AssetStatWidget,
  BalanceWidget,
  BudgetWidget,
  CashFlowWidget,
  InvoiceStatusWidget,
  MarketShareWidget,
  RiskScoreWidget,
  TransactionsWidget,
} from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { FinanceCanvas } from './finance-canvas.tsx'

interface FinanceBehaviorArgs {
  onExpandedChange: (expanded: boolean) => void
  onPeriodChange: (period: string) => void
}

const meta = {
  args: { onExpandedChange: fn(), onPeriodChange: fn() },
  argTypes: {
    onExpandedChange: { control: false },
    onPeriodChange: { control: false },
  },
  decorators: [FinanceCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Finance/Behavior',
} satisfies Meta<FinanceBehaviorArgs>

export default meta

type Story = StoryObj<FinanceBehaviorArgs>

const region = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

export const MarketShareDerivesShares: Story = {
  render: () => (
    <MarketShareWidget
      endLabel="31 May"
      segments={[
        { change: 0.0044, id: 'btc', label: 'Bitcoin', value: 60 },
        { change: 0.0056, id: 'eth', label: 'Ethereum', value: 30 },
        { id: 'other', label: 'Others', value: 10 },
      ]}
      startLabel="1 May"
      title="Market Leaders"
    >
      <AssetList aria-label="Ativos">
        <AssetListItem
          meta="24h: +$500.00"
          name="Bitcoin"
          value="$115,485.04"
        />
      </AssetList>
    </MarketShareWidget>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widget = region(canvasElement, 'Market Leaders')
    await expect(widget.textContent).toContain('Bitcoin: 60.00%')
    await expect(widget.textContent).toContain('Ethereum: 30.00%')
    await expect(widget.textContent).toContain('Others: 10.00%')
    await expect(widget.textContent).toContain('1 May')
    await expect(
      canvas.getByRole('list', { name: 'Ativos' }).textContent,
    ).toContain('24h: +$500.00')
  },
}

export const RiskScoreExposesAMeter: Story = {
  render: () => (
    <RiskScoreWidget
      score={72}
      stats={[
        { id: 'score', label: 'Risk Score', value: '72/100' },
        { id: 'suggestion', label: 'AI Suggestion', value: '15% BTC → ETH' },
      ]}
      title="AI Risk Analysis"
      tone="warning"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('meter', { name: 'AI Risk Analysis' }),
    ).toHaveAttribute('aria-valuenow', '72')
    await expect(
      canvasElement.querySelector('[data-tone="warning"]'),
    ).toHaveClass('bg-warning')
    await expect(canvas.getByText('15% BTC → ETH').tagName).toBe('DD')
  },
}

export const InvertedAssetStatScopesDarkTheme: Story = {
  render: () => (
    <AssetStatWidget
      change={-0.0018}
      format={{ minimumIntegerDigits: 2, style: 'percent' }}
      label="Reward rate"
      name="Zcash"
      symbol="ZEC"
      tone="inverted"
      value={0.0934}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="asset-stat-widget-scope"]'),
    ).toHaveClass('dark')
    await expect(
      within(canvasElement).getByRole('region', { name: /^Zcash ?ZEC$/ }),
    ).toBeVisible()
    await expect(canvasElement.textContent).toContain('09.34%')
  },
}

export const BalanceDescribesItsChart: Story = {
  render: () => (
    <BalanceWidget
      change={0.0412}
      changeLabel="vs. last month"
      chartLabel="Balance over the last 6 months"
      data={[
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 12 },
      ]}
      title="Total balance"
      value={48250.75}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', { name: 'Balance over the last 6 months' }),
    ).toBeVisible()
    await expect(region(canvasElement, 'Total balance').textContent).toContain(
      '$48,250.75',
    )
  },
}

export const BalanceEmitsThePeriod: Story = {
  render: ({ onPeriodChange }) => (
    <BalanceWidget
      chartLabel="Balance over the last 6 months"
      data={[
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 12 },
      ]}
      onPeriodChange={onPeriodChange}
      period="6m"
      periods={[
        { label: '1M', value: '1m' },
        { label: '6M', value: '6m' },
      ]}
      title="Total balance"
      value={48250.75}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: '1M' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledOnce()
    await expect(args.onPeriodChange).toHaveBeenLastCalledWith('1m')
  },
}

export const BudgetSumsAndFlagsOverspend: Story = {
  render: () => (
    <BudgetWidget
      categories={[
        { id: 'food', label: 'Groceries', limit: 600, spent: 420 },
        { id: 'fun', label: 'Entertainment', limit: 200, spent: 260 },
      ]}
      title="Monthly budget"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widget = region(canvasElement, 'Monthly budget')
    await expect(widget.textContent).toContain('$680.00')
    await expect(widget.textContent).toContain('Limite $800.00')
    await expect(widget.textContent).toContain('70.00%')
    await expect(
      canvas.getByRole('meter', { name: 'Groceries' }),
    ).toHaveAttribute('aria-valuenow', '420')
    await expect(
      canvas.getByRole('meter', { name: 'Entertainment' }),
    ).toHaveAttribute('aria-valuenow', '200')
    const over = canvasElement.querySelector('[data-over="true"]')
    await expect(over?.textContent).toContain('Entertainment')
    await expect(over?.querySelector('.bg-destructive')).not.toBeNull()
  },
}

export const BudgetIconAndBarShareColor: Story = {
  render: () => (
    <BudgetWidget
      categories={[
        {
          color: '#2563eb',
          icon: <svg aria-hidden="true" />,
          id: 'housing',
          label: 'Housing',
          limit: 1800,
          spent: 900,
        },
        { id: 'fallback', label: 'Fallback', limit: 100, spent: 10 },
      ]}
      title="Budget"
    />
  ),
  play: async ({ canvasElement }) => {
    const rows = [
      ...canvasElement.querySelectorAll('[data-slot="budget-category"]'),
    ]
    const circle = rows[0]?.querySelector('[data-slot="icon-frame"]')
    const bar = rows[0]?.querySelector(
      '[data-slot="meter-indicator"], [style*="background-color"]',
    )
    await expect(circle?.getAttribute('style')).toContain(
      'color: rgb(37, 99, 235)',
    )
    await expect(bar?.getAttribute('style')).toContain('rgb(37, 99, 235)')
    await expect(rows[1]?.querySelector('[data-slot="icon-frame"]')).toBeNull()
  },
}

export const BudgetPeriodsReplaceTheAction: Story = {
  render: () => (
    <BudgetWidget
      action={
        <Button size="sm" variant="ghost">
          View all
        </Button>
      }
      categories={[{ id: 'food', label: 'Groceries', limit: 600, spent: 420 }]}
      period="month"
      periodLabel="Budget period"
      periods={[
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ]}
      title="Budget"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Budget period' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'View all' })).toBeNull()
  },
}

export const CashFlowTotalsAndFlagsANegativeNet: Story = {
  render: () => (
    <CashFlowWidget
      chartLabel="Cash flow over the quarter"
      data={[
        { expenses: 800, income: 1200, label: 'Jan' },
        { expenses: 1500, income: 1000, label: 'Feb' },
      ]}
      expensesLabel="Expenses"
      incomeLabel="Income"
      netLabel="Net"
      title="Cash flow"
    />
  ),
  play: async ({ canvasElement }) => {
    const widget = region(canvasElement, 'Cash flow')
    await expect(widget.textContent).toContain('Income$2,200.00')
    await expect(widget.textContent).toContain('Expenses$2,300.00')
    await expect(widget.textContent).toContain('Net-$100.00')
    await expect(
      widget.querySelector('.text-destructive-foreground')?.textContent,
    ).toBe('-$100.00')
  },
}

export const CashFlowDescribesItsChart: Story = {
  render: () => (
    <CashFlowWidget
      chartLabel="Cash flow over the quarter"
      data={[
        { expenses: 800, income: 1200, label: 'Jan' },
        { expenses: 1500, income: 1000, label: 'Feb' },
      ]}
      expensesLabel="Expenses"
      incomeLabel="Income"
      netLabel="Net"
      title="Cash flow"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Cash flow over the quarter',
      }),
    ).toBeVisible()
  },
}

export const CashFlowEmitsThePeriod: Story = {
  render: ({ onPeriodChange }) => (
    <CashFlowWidget
      chartLabel="Cash flow over the quarter"
      data={[
        { expenses: 800, income: 1200, label: 'Jan' },
        { expenses: 1500, income: 1000, label: 'Feb' },
      ]}
      expensesLabel="Expenses"
      incomeLabel="Income"
      netLabel="Net"
      onPeriodChange={onPeriodChange}
      period="q"
      periods={[
        { label: 'Quarter', value: 'q' },
        { label: 'Year', value: 'y' },
      ]}
      title="Cash flow"
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Year' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledOnce()
    await expect(args.onPeriodChange).toHaveBeenLastCalledWith('y')
  },
}

export const TransactionsSignCredits: Story = {
  render: () => (
    <TransactionsWidget
      title="Recent transactions"
      transactions={[
        {
          amount: 2500,
          id: 'salary',
          meta: 'Salary · Jun 1',
          name: 'Acme Inc.',
        },
        {
          amount: -42.9,
          id: 'coffee',
          meta: 'Food · Jun 2',
          name: 'Coffee shop',
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Recent transactions',
    })
    const amounts = [
      ...list.querySelectorAll('[data-slot="transaction-amount"]'),
    ]
    await expect(amounts.map((node) => node.textContent)).toEqual([
      '+$2,500.00',
      '-$42.90',
    ])
    await expect(amounts[0]).toHaveClass('text-success-foreground')
    await expect(
      canvasElement.querySelector('[data-kind="debit"]')?.textContent,
    ).toContain('Coffee shop')
  },
}

export const TransactionsShowTheEmptyLabel: Story = {
  render: () => (
    <TransactionsWidget
      emptyLabel="Nothing yet"
      title="Recent transactions"
      transactions={[]}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Nothing yet')).toBeVisible()
  },
}

export const TransactionsCollapseAndExpand: Story = {
  render: ({ onExpandedChange }) => (
    <TransactionsWidget
      onExpandedChange={onExpandedChange}
      title="Transactions"
      transactions={Array.from({ length: 12 }, (_, index) => ({
        amount: -(index + 1),
        id: `t${index}`,
        name: `Item ${index + 1}`,
      }))}
      visibleCount={5}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const widget = region(canvasElement, 'Transactions')
    const scoped = within(widget)
    await expect(widget).toHaveAttribute('data-expanded', 'false')
    await expect(scoped.getAllByRole('listitem')).toHaveLength(5)
    await userEvent.click(
      scoped.getByRole('button', { name: 'Ver todas (+7)' }),
    )
    await expect(args.onExpandedChange).toHaveBeenCalledOnce()
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(true)
    await expect(widget).toHaveAttribute('data-expanded', 'true')
    await expect(scoped.getAllByRole('listitem')).toHaveLength(12)
    await expect(
      canvasElement.querySelector('[data-slot="transactions-scroll"]'),
    ).not.toBeNull()
    await userEvent.click(scoped.getByRole('button', { name: 'Ver menos' }))
    await expect(args.onExpandedChange).toHaveBeenCalledTimes(2)
    await expect(scoped.getAllByRole('listitem')).toHaveLength(5)
  },
}

export const InvoiceStatusTotalsAndShares: Story = {
  render: () => (
    <InvoiceStatusWidget
      countLabel={(count) => `${count} invoices`}
      statuses={[
        { count: 12, id: 'paid', label: 'Paid', tone: 'success', value: 6000 },
        { count: 3, id: 'due', label: 'Due', tone: 'warning', value: 3000 },
        {
          count: 1,
          id: 'late',
          label: 'Overdue',
          tone: 'destructive',
          value: 1000,
        },
      ]}
      title="Receivables"
      totalLabel="Outstanding"
    />
  ),
  play: async ({ canvasElement }) => {
    const widget = region(canvasElement, 'Receivables')
    await expect(widget.textContent).toContain('Outstanding')
    await expect(widget.textContent).toContain('$10,000.00')
    await expect(widget.textContent).toContain('Paid: 60.00%')
    await expect(widget.textContent).toContain('Overdue: 10.00%')
    await expect(widget.textContent).toContain('12 invoices')
    await expect(
      canvasElement.querySelector(
        '[data-slot="invoice-status-item"][data-tone="warning"]',
      )?.textContent,
    ).toContain('$3,000.00')
  },
}
