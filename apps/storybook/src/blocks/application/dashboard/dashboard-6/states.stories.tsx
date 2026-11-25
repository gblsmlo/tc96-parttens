import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard6 } from '@tc96/ui/blocks/application/dashboard/dashboard-6'
import { expect, fn, within } from 'storybook/test'
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', {
        name: 'Leads em aberto por etapa',
      }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando o resumo do funil'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar o resumo do funil',
      ),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { lossReasons: [], stages: [], summary: undefined },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum lead no funil'),
    ).toBeVisible()
  },
}
