import type { Meta, StoryObj } from '@storybook/react-vite'
import { MetricWidget } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { FinanceDashboardCanvas } from './finance-canvas.tsx'
import {
  CashFlow,
  MarketLeaders,
  MonthlyBudget,
  Receivables,
  RecentTransactions,
  RiskAnalysis,
  StakingYield,
  TotalBalance,
  ZcashReward,
} from './finance-layouts.tsx'

const meta = {
  decorators: [FinanceDashboardCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Finance/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const MarketOverview: Story = {
  render: () => (
    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="grid content-start gap-4">
        <MarketLeaders />
        <TotalBalance />
      </div>
      <div className="grid content-start gap-4">
        <RiskAnalysis />
        <div className="grid gap-4 sm:grid-cols-2">
          <ZcashReward tone="inverted" />
          <StakingYield />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Market Leaders' }),
    ).toHaveTextContent('Bitcoin: 66.00%')
    await expect(
      canvas.getByRole('meter', { name: 'AI Risk Analysis' }),
    ).toHaveAttribute('aria-valuenow', '72')
  },
}

export const PersonalOverview: Story = {
  render: () => (
    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
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
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Budget' }),
    ).toHaveTextContent('$2,676.95')
    await expect(
      canvas.getByRole('list', { name: 'Recent transactions' }),
    ).toHaveTextContent('+$4,850.00')
  },
}

export const BusinessOverview: Story = {
  render: () => (
    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
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
            format={{ style: 'percent' }}
            label="Gross margin"
            value={0.612}
          />
        </div>
      </div>
      <Receivables />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Cash flow' }),
    ).toHaveTextContent('$158,600.00')
    await expect(
      canvas.getByRole('region', { name: 'Invoices' }),
    ).toHaveTextContent('Paid: 62.00%')
  },
}
