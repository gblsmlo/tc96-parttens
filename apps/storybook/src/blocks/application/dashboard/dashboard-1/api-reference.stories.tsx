import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard1 } from '@tc96/blocks/application/dashboard/dashboard-1'
import { fn } from 'storybook/test'
import {
  capacity,
  exceptions,
  filterOptions,
  kpis,
  reasons,
} from '../fixtures/dashboard-1.ts'
import { breadcrumbsFor, periodOptions } from '../fixtures/shared.ts'

const meta = {
  args: {
    breadcrumbs: breadcrumbsFor('Exceções de expedição'),
    capacity,
    exceptions,
    filter: 'all',
    filterOptions,
    kpis,
    onExport: fn(),
    onFilterChange: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    period: '7d',
    periodOptions,
    reasons,
  },
  component: Dashboard1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Dashboard/Dashboard1/API Reference',
} satisfies Meta<typeof Dashboard1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
