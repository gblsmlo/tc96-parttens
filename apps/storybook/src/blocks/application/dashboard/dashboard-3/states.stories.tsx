import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard3 } from '@tc96/ui/blocks/application/dashboard/dashboard-3'
import { fn } from 'storybook/test'
import { crew, forecast, kpis, queue } from '../fixtures/dashboard-3.ts'
import { breadcrumbsFor, periodOptions } from '../fixtures/shared.ts'

const meta = {
  args: {
    breadcrumbs: breadcrumbsFor('Cobertura das equipes'),
    crew,
    forecast,
    kpis,
    onAction: fn(),
    onExport: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    period: '7d',
    periodOptions,
    queue,
  },
  component: Dashboard3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard3/States',
} satisfies Meta<typeof Dashboard3>

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
  args: { crew: [], forecast: [], kpis: [], queue: [] },
}
