import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Dashboard7,
  type Dashboard7CategoryKind,
} from '@tc96/ui/blocks/application/dashboard/dashboard-7'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  balances,
  cashFlow,
  dueSoon,
  expenseByCategory,
  incomeByCategory,
  indicators,
} from '../fixtures/dashboard-7.ts'
import {
  type Dashboard7Controls,
  dashboard7ControlArgs,
} from './dashboard-7-controls.ts'
import { ComposedDashboard7 } from './dashboard-7-layouts.tsx'

const meta = {
  args: {
    ...dashboard7ControlArgs,
    onAccountChange: fn(),
    onCategoryKindChange: fn(),
    onCellSelect: fn(),
    onClientMoneyPageChange: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard7/Behavior',
} satisfies Meta<
  Dashboard7Controls & {
    onAccountChange: (account: string) => void
    onCategoryKindChange: (kind: Dashboard7CategoryKind) => void
    onCellSelect: (rowId: string, month: string) => void
    onClientMoneyPageChange: (page: number) => void
    onPeriodChange: (period: string) => void
    onRetry: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = {
  cashFlow,
  dueSoon,
  expenseByCategory,
  incomeByCategory,
  timeZone: 'America/Sao_Paulo',
}

const emptyProps = {
  cashFlow: [],
  dueSoon: [],
  expenseByCategory: [],
  incomeByCategory: [],
}

export const PeriodSelectCallsOnPeriodChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Período' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Últimos 12 meses' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledWith('last')
  },
}

export const AccountFilterCallsOnAccountChange: Story = {
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Conta' })
    await userEvent.click(
      within(group).getByRole('button', { name: 'Conta principal' }),
    )
    await expect(args.onAccountChange).toHaveBeenCalledWith('principal')
  },
}

export const CategoryKindSwitchesTheChart: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('img', { name: 'Receita por categoria' }),
    ).toBeInTheDocument()
    const group = canvas.getByRole('group', { name: 'Tipo de categoria' })
    await userEvent.click(
      within(group).getByRole('button', { name: 'Despesas' }),
    )
    await expect(args.onCategoryKindChange).toHaveBeenCalledWith('expense')
    const chart = await canvas.findByRole('img', {
      name: 'Despesa por categoria',
    })
    await expect(chart.querySelector('desc')).toHaveTextContent(
      /Folha: R\$\s?93\.000,00/,
    )
  },
}

export const FiltersRenderOnlyWithTheirCallbacks: Story = {
  args: { filters: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('group', { name: 'Conta' })).toBeNull()
    await expect(
      canvas.queryByRole('group', { name: 'Tipo de categoria' }),
    ).toBeNull()
  },
}

export const BalanceCardsShowValueAndExplanation: Story = {
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-metric="realized"]')
    await expect(card).toHaveTextContent('Saldo realizado hoje')
    await expect(card).toHaveTextContent(/R\$\s?30\.000,00/)
    await expect(card).toHaveTextContent('Todas as contas')
    await expect(card).toHaveTextContent(
      'Saldo de abertura das contas mais tudo o que foi pago e recebido até hoje.',
    )
    await expect(
      within(canvasElement).getByText(/Saldo previsto em 25\/12\/2026/),
    ).toBeVisible()
  },
}

export const IndicatorsShowFormattedValues: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Indicadores',
    })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(4)
    await expect(
      canvasElement.querySelector('[data-metric="delinquency"]'),
    ).toHaveTextContent('12%')
    await expect(
      canvasElement.querySelector('[data-metric="collection-days"]'),
    ).toHaveTextContent('21 dias')
    await expect(
      canvasElement.querySelector('[data-metric="cash-margin"]'),
    ).toHaveTextContent('30%')
    await expect(
      canvasElement.querySelector('[data-metric="runway"]'),
    ).toHaveTextContent('2,5 meses')
  },
}

export const IndicatorWithoutValueShowsNoData: Story = {
  render: () => (
    <Dashboard7
      {...baseProps}
      indicators={{
        ...indicators,
        delinquency: {
          detail: 'no período de ago. a out. de 2026',
          ratio: null,
        },
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-metric="delinquency"]'),
    ).toHaveTextContent('Sem dados')
  },
}

export const CashFlowChartHasNameAndSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = await within(canvasElement).findByRole('img', {
      name: 'Entradas e saídas por mês, com os meses previstos tracejados',
    })
    const summary = chart.querySelector('desc')
    await expect(summary).toHaveTextContent(
      /ago\.? de 2026: entradas R\$\s?42\.000,00, saídas R\$\s?29\.000,00/,
    )
    await expect(summary).toHaveTextContent(/dez\.? de 2026 \(previsto\)/)
    await expect(summary).not.toHaveTextContent(/nov\.? de 2026 \(previsto\)/)
  },
}

export const CashFlowLegendMarksTheForecast: Story = {
  play: async ({ canvasElement }) => {
    const legend = within(canvasElement).getByRole('list', {
      name: 'Legenda do gráfico',
    })
    await expect(within(legend).getAllByRole('listitem')).toHaveLength(3)
    await expect(
      legend.querySelector('[data-series="forecast"]'),
    ).toHaveTextContent('Previsto')
    await expect(
      canvasElement.querySelector('[data-total="result"]'),
    ).toHaveTextContent(/R\$\s?56\.000,00/)
  },
}

export const ReceivablesChartHasNameAndSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = await within(canvasElement).findByRole('img', {
      name: 'Valores a receber, vencidos e recebidos no período',
    })
    await expect(chart.querySelector('desc')).toHaveTextContent(
      /A receber: R\$\s?50\.000,00; Vencido: R\$\s?30\.000,00; Recebido: R\$\s?124\.000,00/,
    )
    await expect(
      canvasElement.querySelector('[data-slot="dashboard-receivables-total"]'),
    ).toHaveTextContent(/R\$\s?204\.000,00/)
  },
}

export const DueSoonRowsLinkToTheEntry: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Honorários Silva' }),
    ).toHaveAttribute('href', '/financeiro/lancamentos/e1')
    const row = canvasElement.querySelector('[data-item="e2"]')
    await expect(row).toHaveTextContent('Despesa · 27/11/2026')
    await expect(row?.querySelector('[data-slot="badge"]')).toHaveTextContent(
      'Vencido',
    )
  },
}

export const AccountRowsLinkToTheAccount: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Conta principal' }),
    ).toHaveAttribute('href', '/financeiro/contas/principal')
  },
}

export const ClientMoneyPaginationCallsOnPageChange: Story = {
  play: async ({ args, canvasElement }) => {
    const pages = within(canvasElement).getByRole('navigation', {
      name: 'Paginação de valores de clientes',
    })
    await expect(pages).toHaveTextContent('Página 1 de 2')
    await userEvent.click(
      within(pages).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onClientMoneyPageChange).toHaveBeenCalledWith(2)
    await expect(
      canvasElement.querySelector('[data-client="c12"]'),
    ).toHaveTextContent('Marcos Vinícius Albuquerque')
  },
}

export const GridMonthsShowTheirColumnKind: Story = {
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('table', {
      name: 'Fluxo de caixa',
    })
    await expect(
      grid.querySelector('[data-month="2026-08"]'),
    ).toHaveTextContent('Realizado')
    await expect(
      grid.querySelector('[data-month="2026-11"]'),
    ).toHaveTextContent('Mês atual')
    await expect(
      grid.querySelector('[data-month="2026-12"]'),
    ).toHaveTextContent('Previsto')
    await expect(grid.querySelector('[data-row="expense"]')).toHaveTextContent(
      'Saídas',
    )
  },
}

export const GridCellCallsOnCellSelect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: /^Lançamentos de Honorários em ago\.? de 2026/,
      }),
    )
    await expect(args.onCellSelect).toHaveBeenCalledWith('income:4', '2026-08')
  },
}

export const GridCellsArePlainWithoutOnCellSelect: Story = {
  args: { cellDrillDown: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryAllByRole('button', {
        name: /^Lançamentos de/,
      }),
    ).toHaveLength(0)
    await expect(
      canvasElement.querySelector('[data-row="income:4"]'),
    ).toHaveTextContent(/R\$\s?30\.000,00/)
  },
}

export const EmptyShowsEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum lançamento no período')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando o analítico financeiro'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Analítico financeiro')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar o analítico'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar de novo' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard7 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar de novo' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <Dashboard7 {...emptyProps} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando o analítico financeiro'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Dashboard7 {...emptyProps} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhum lançamento no período')).toBeNull()
  },
}

export const LocaleFormatsMoney: Story = {
  render: () => (
    <Dashboard7 {...baseProps} balances={balances} locale="en-US" />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-metric="realized"]'),
    ).toHaveTextContent(/30,000\.00/)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard7
      {...baseProps}
      balances={balances}
      labels={{
        dueSoonTitle: 'Due this week',
        realizedBalance: 'Balance today',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('list', { name: 'Due this week' }),
    ).toBeVisible()
    await expect(
      canvasElement.querySelector('[data-metric="realized"]'),
    ).toHaveTextContent('Balance today')
  },
}
