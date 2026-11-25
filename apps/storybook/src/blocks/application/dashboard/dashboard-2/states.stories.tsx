import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard2 } from '@tc96/ui/blocks/application/dashboard/dashboard-2'
import { fn } from 'storybook/test'
import {
  channels,
  initialSort,
  kpis,
  orders,
  sales,
} from '../fixtures/dashboard-2.ts'
import { breadcrumbsFor, periodOptions } from '../fixtures/shared.ts'

const meta = {
  args: {
    breadcrumbs: breadcrumbsFor('Receita do varejo'),
    channels,
    kpis,
    onExport: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    onSortChange: fn(),
    orders,
    period: '7d',
    periodOptions,
    sales,
    sort: initialSort,
  },
  component: Dashboard2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard2/States',
} satisfies Meta<typeof Dashboard2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { kpis: [], orders: [], sales: [] },
}
