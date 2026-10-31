import type { Meta, StoryObj } from '@storybook/react-vite'
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
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const onPeriodChange = fn()
const onExpandedChange = fn()

const meta = {
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Finance/Behavior',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const MarketShareDerivesShares: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Market Leaders' })
    await expect(region.textContent).toContain('Bitcoin: 60.00%')
    await expect(region.textContent).toContain('Ethereum: 30.00%')
    await expect(region.textContent).toContain('Others: 10.00%')
    await expect(region.textContent).toContain('1 May')
    await expect(
      canvas.getByRole('list', { name: 'Ativos' }).textContent,
    ).toContain('24h: +$500.00')
  },
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
}

export const RiskScoreExposesMeter: Story = {
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
}

export const InvertedAssetStatScopesDarkTheme: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="asset-stat-widget-scope"]'),
    ).toHaveClass('dark')
    await expect(
      within(canvasElement).getByRole('region', { name: /^Zcash ?ZEC$/ }),
    ).toBeVisible()
    await expect(canvasElement.textContent).toContain('09.34%')
  },
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
}

export const BalanceDescribesChart: Story = {
  play: async ({ canvasElement }) => {
    onPeriodChange.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', { name: 'Balance over the last 6 months' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Total balance' }).textContent,
    ).toContain('$48,250.75')
    await userEvent.click(canvas.getByRole('button', { name: '1M' }))
    await expect(onPeriodChange).toHaveBeenCalledTimes(1)
    await expect(onPeriodChange).toHaveBeenCalledWith('1m')
  },
  render: () => (
    <BalanceWidget
      change={0.0412}
      changeLabel="vs. last month"
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
}

export const BudgetSumsAndFlagsOverspend: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Monthly budget' })
    await expect(region.textContent).toContain('$680.00')
    await expect(region.textContent).toContain('Limite $800.00')
    await expect(region.textContent).toContain('70.00%')
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
  render: () => (
    <BudgetWidget
      categories={[
        { id: 'food', label: 'Groceries', limit: 600, spent: 420 },
        { id: 'fun', label: 'Entertainment', limit: 200, spent: 260 },
      ]}
      title="Monthly budget"
    />
  ),
}

export const CashFlowTotalsAndDescribesChart: Story = {
  play: async ({ canvasElement }) => {
    onPeriodChange.mockClear()
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Cash flow' })
    await expect(region.textContent).toContain('Income$2,200.00')
    await expect(region.textContent).toContain('Expenses$2,300.00')
    await expect(region.textContent).toContain('Net-$100.00')
    await expect(
      region.querySelector('.text-destructive-foreground')?.textContent,
    ).toBe('-$100.00')
    await expect(
      canvas.getByRole('img', { name: 'Cash flow over the quarter' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Year' }))
    await expect(onPeriodChange).toHaveBeenCalledTimes(1)
    await expect(onPeriodChange).toHaveBeenCalledWith('y')
  },
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
      onPeriodChange={onPeriodChange}
      period="q"
      periods={[
        { label: 'Quarter', value: 'q' },
        { label: 'Year', value: 'y' },
      ]}
      title="Cash flow"
    />
  ),
}

export const TransactionsSignCredits: Story = {
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
}

export const TransactionsEmptyState: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Nothing yet')).toBeVisible()
  },
  render: () => (
    <TransactionsWidget
      emptyLabel="Nothing yet"
      title="Recent transactions"
      transactions={[]}
    />
  ),
}

export const InvoiceStatusTotalsAndShares: Story = {
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Receivables',
    })
    await expect(region.textContent).toContain('Outstanding')
    await expect(region.textContent).toContain('$10,000.00')
    await expect(region.textContent).toContain('Paid: 60.00%')
    await expect(region.textContent).toContain('Overdue: 10.00%')
    await expect(region.textContent).toContain('12 invoices')
    await expect(
      canvasElement.querySelector(
        '[data-slot="invoice-status-item"][data-tone="warning"]',
      )?.textContent,
    ).toContain('$3,000.00')
  },
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
}

export const BudgetIconAndBarShareColor: Story = {
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
}

export const TransactionsCollapseAndExpand: Story = {
  play: async ({ canvasElement }) => {
    onExpandedChange.mockClear()
    const region = within(canvasElement).getByRole('region', {
      name: 'Transactions',
    })
    const scoped = within(region)
    await expect(region).toHaveAttribute('data-expanded', 'false')
    await expect(scoped.getAllByRole('listitem')).toHaveLength(5)
    await userEvent.click(
      scoped.getByRole('button', { name: 'Ver todas (+7)' }),
    )
    await expect(onExpandedChange).toHaveBeenCalledTimes(1)
    await expect(onExpandedChange).toHaveBeenCalledWith(true)
    await expect(region).toHaveAttribute('data-expanded', 'true')
    await expect(scoped.getAllByRole('listitem')).toHaveLength(12)
    await expect(
      canvasElement.querySelector('[data-slot="transactions-scroll"]'),
    ).not.toBeNull()
    await userEvent.click(scoped.getByRole('button', { name: 'Ver menos' }))
    await expect(scoped.getAllByRole('listitem')).toHaveLength(5)
  },
  render: () => (
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
}
