import type { Meta, StoryObj } from '@storybook/react-vite'
import { FinanceCanvas } from './finance-canvas.tsx'
import {
  type FinanceControls,
  financeControlArgs,
  financeControlArgTypes,
} from './finance-controls.ts'
import { ComposedFinance } from './finance-layouts.tsx'

const meta = {
  args: financeControlArgs,
  argTypes: financeControlArgTypes,
  decorators: [FinanceCanvas],
  parameters: {
    controls: { exclude: ['empty', 'riskTone', 'tone', 'widget'] },
    layout: 'padded',
  },
  render: (args) => <ComposedFinance {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Finance/Stories',
} satisfies Meta<FinanceControls>

export default meta

type Story = StoryObj<FinanceControls>

export const Default: Story = {}

export const Balance: Story = {
  args: { widget: 'balance' },
}

export const Budget: Story = {
  args: { widget: 'budget' },
}

export const CashFlow: Story = {
  args: { widget: 'cash-flow' },
  name: 'Cash flow',
}

export const Transactions: Story = {
  args: { widget: 'transactions' },
}

export const InvoiceStatus: Story = {
  args: { widget: 'invoice-status' },
  name: 'Invoice status',
}

export const RiskScore: Story = {
  args: { widget: 'risk-score' },
  name: 'Risk score',
}

export const RiskScoreWarning: Story = {
  args: { riskTone: 'warning', widget: 'risk-score' },
  name: 'Risk score warning',
}

export const RiskScoreDestructive: Story = {
  args: { riskTone: 'destructive', widget: 'risk-score' },
  name: 'Risk score destructive',
}

export const RiskScoreInfo: Story = {
  args: { riskTone: 'info', widget: 'risk-score' },
  name: 'Risk score info',
}

export const AssetStat: Story = {
  args: { widget: 'asset-stat' },
  name: 'Asset stat',
}

export const AssetStatInverted: Story = {
  args: { tone: 'inverted', widget: 'asset-stat' },
  name: 'Asset stat inverted',
}

export const TransactionsEmpty: Story = {
  args: { empty: true, widget: 'transactions' },
  name: 'Transactions empty',
}
