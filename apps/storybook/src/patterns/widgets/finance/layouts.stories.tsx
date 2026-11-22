import type { Meta, StoryObj } from '@storybook/react-vite'
import { FinanceCanvas } from './finance-canvas.tsx'
import { financeControlArgs } from './finance-controls.ts'
import {
  AssetStatWithoutTrend,
  ComposedFinance,
  MarketShareBar,
  RiskScoreBare,
} from './finance-layouts.tsx'

const meta = {
  decorators: [FinanceCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Finance/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BalanceWithoutPeriods: Story = {
  render: () => (
    <ComposedFinance {...financeControlArgs} periods={false} widget="balance" />
  ),
}

export const BudgetWithAction: Story = {
  render: () => (
    <ComposedFinance
      {...financeControlArgs}
      action
      periods={false}
      widget="budget"
    />
  ),
}

export const MarketShareBarOnly: Story = {
  render: () => <MarketShareBar />,
}

export const RiskScoreMeterOnly: Story = {
  render: () => <RiskScoreBare />,
}

export const AssetStatWithoutChange: Story = {
  render: () => <AssetStatWithoutTrend />,
}
