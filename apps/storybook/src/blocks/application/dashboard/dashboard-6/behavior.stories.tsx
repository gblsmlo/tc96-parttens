import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard6 } from '@tc96/ui/blocks/application/dashboard/dashboard-6'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { lossReasons, stages, summary } from '../fixtures/dashboard-6.ts'
import {
  type Dashboard6Controls,
  dashboard6ControlArgs,
} from './dashboard-6-controls.ts'
import { ComposedDashboard6 } from './dashboard-6-layouts.tsx'

const meta = {
  args: {
    ...dashboard6ControlArgs,
    onPeriodChange: fn(),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard6/Behavior',
} satisfies Meta<
  Dashboard6Controls & {
    onPeriodChange: (period: string) => void
    onRetry: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = { lossReasons, stages, summary }

export const PeriodSelectCallsOnPeriodChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Período do resumo' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Este trimestre' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledWith('quarter')
    await expect(
      canvas.getByRole('combobox', { name: 'Período do resumo' }),
    ).toHaveTextContent('Este trimestre')
  },
}

export const PeriodSelectRendersOnlyWithOnPeriodChange: Story = {
  args: { periodSelect: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('combobox', {
        name: 'Período do resumo',
      }),
    ).toBeNull()
  },
}

export const KpiCardsShowCountsMoneyAndConversion: Story = {
  play: async ({ canvasElement }) => {
    const open = canvasElement.querySelector('[data-metric="open"]')
    await expect(open).toHaveTextContent('23 leads')
    await expect(open).toHaveTextContent(/138\.500,00/)
    await expect(
      canvasElement.querySelector('[data-metric="won"]'),
    ).toHaveTextContent('11 leads')
    await expect(
      canvasElement.querySelector('[data-metric="conversion"]'),
    ).toHaveTextContent('42%')
  },
}

export const ConversionWithoutClosedLeadsShowsDash: Story = {
  render: () => (
    <Dashboard6 {...baseProps} summary={{ ...summary, conversion: null }} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '[data-metric="conversion"] [data-slot="dashboard-metric-value"]',
      ),
    ).toHaveTextContent('—')
  },
}

export const KpiListDropsWithoutSummary: Story = {
  render: () => <Dashboard6 {...baseProps} summary={undefined} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('list', { name: 'Indicadores' })).toBeNull()
    await expect(
      canvas.getByRole('table', { name: 'Leads em aberto por etapa' }),
    ).toBeVisible()
  },
}

export const FunnelChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = await within(canvasElement).findByRole('img', {
      name: 'Leads em aberto por etapa',
    })
    await expect(chart.querySelector('desc')).toHaveTextContent(
      /Novo: 8 leads.*Fechamento: 1 lead/,
    )
  },
}

export const StageTableLinksEachStage: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-stage="st-novo"]')
    if (!(row instanceof HTMLElement)) throw new Error('missing stage row')
    await expect(
      within(row).getByRole('link', { name: 'Novo' }),
    ).toHaveAttribute('href', '/crm/funil?etapa=st-novo')
    await expect(row).toHaveTextContent('8')
    await expect(row).toHaveTextContent(/36\.000,00/)
  },
}

export const LossChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = await within(canvasElement).findByRole('img', {
      name: 'Leads perdidos por motivo',
    })
    await expect(chart.querySelector('desc')).toHaveTextContent(
      /Sem retorno: 6 leads.*Fora do escopo: 1 lead/,
    )
  },
}

export const NoLossesShowsMessage: Story = {
  render: () => <Dashboard6 {...baseProps} lossReasons={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma perda no período.')).toBeVisible()
    await expect(
      canvas.queryByRole('img', { name: 'Leads perdidos por motivo' }),
    ).toBeNull()
  },
}

export const EmptyShowsEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum lead no funil')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando o resumo do funil'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { name: 'Analítico' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar o resumo do funil'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard6 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar de novo' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <Dashboard6 error lossReasons={[]} pending stages={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando o resumo do funil'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Dashboard6 error lossReasons={[]} stages={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhum lead no funil')).toBeNull()
  },
}

export const LocaleFormatsMoney: Story = {
  render: () => <Dashboard6 {...baseProps} currency="USD" locale="en-US" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-metric="open"]'),
    ).toHaveTextContent('$138,500.00')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard6
      {...baseProps}
      labels={{
        funnelLabel: 'Open leads by stage',
        lossesTitle: 'Losses',
        openLabel: 'Open',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('table', { name: 'Open leads by stage' }),
    ).toBeVisible()
    await expect(canvas.getByText('Losses')).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-metric="open"]'),
    ).toHaveTextContent('Open')
  },
}
