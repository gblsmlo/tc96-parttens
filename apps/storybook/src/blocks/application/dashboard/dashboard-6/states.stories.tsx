import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard6 } from '@tc96/ui/blocks/application/dashboard/dashboard-6'
import { fn } from 'storybook/test'
import {
  crmPeriodOptions,
  lossReasons,
  stages,
  summary,
} from '../fixtures/dashboard-6.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'

const meta = {
  args: {
    breadcrumbs: breadcrumbsFor('Analítico'),
    lossReasons,
    onPeriodChange: fn(),
    onRetry: fn(),
    period: 'month',
    periodOptions: crmPeriodOptions,
    stages,
    summary,
  },
  component: Dashboard6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard6/States',
} satisfies Meta<typeof Dashboard6>

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
  args: { lossReasons: [], stages: [], summary: undefined },
}
