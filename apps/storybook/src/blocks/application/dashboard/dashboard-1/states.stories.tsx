import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard1 } from '@tc96/ui/blocks/application/dashboard/dashboard-1'
import { expect, fn, within } from 'storybook/test'
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
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard1/States',
} satisfies Meta<typeof Dashboard1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Exceções abertas' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando exceções de expedição'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as exceções'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { capacity: [], exceptions: [], kpis: [], reasons: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma exceção de expedição'),
    ).toBeVisible()
  },
}
