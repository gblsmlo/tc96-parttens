import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard4 } from '@tc96/ui/blocks/application/dashboard/dashboard-4'
import { fn } from 'storybook/test'
import { initialSort, metrics, modules, team } from '../fixtures/dashboard-4.ts'
import { dashboard4Breadcrumbs } from './dashboard-4-layouts.tsx'

const meta = {
  args: {
    breadcrumbs: dashboard4Breadcrumbs,
    metrics,
    modules: modules.slice(0, 10),
    onAddModule: fn(),
    onInvite: fn(),
    onRetry: fn(),
    onSortChange: fn(),
    sort: initialSort,
    team,
  },
  component: Dashboard4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard4/States',
} satisfies Meta<typeof Dashboard4>

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
  args: { metrics: [], modules: [] },
}
