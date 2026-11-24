import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard1 } from '@tc96/ui/blocks/application/dashboard/dashboard-1'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  capacity,
  exceptions,
  filterOptions,
  kpis,
  reasons,
} from '../fixtures/dashboard-1.ts'
import {
  type Dashboard1Controls,
  dashboard1ControlArgs,
} from './dashboard-1-controls.ts'
import { ComposedDashboard1 } from './dashboard-1-layouts.tsx'

const meta = {
  args: {
    ...dashboard1ControlArgs,
    onExport: fn(),
    onFilterChange: fn(),
    onPageChange: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    onRowAction: fn(),
    onSearchChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard1/Behavior',
} satisfies Meta<
  Dashboard1Controls & {
    onExport: () => void
    onFilterChange: (filter: string) => void
    onPageChange: (page: number) => void
    onPeriodChange: (period: string) => void
    onRetry: () => void
    onRowAction: (actionId: string, exceptionId: string) => void
    onSearchChange: (search: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = {
  capacity,
  exceptions,
  filter: 'all',
  filterOptions,
  kpis,
  onFilterChange: () => undefined,
}

export const HeaderShowsBreadcrumbTitleAndDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trail = canvas.getByRole('navigation', {
      name: 'Navegação estrutural',
    })
    await expect(
      within(trail).getByRole('link', { name: 'Painéis' }),
    ).toHaveAttribute('href', '/painel')
    await expect(
      canvas.getByRole('heading', { name: 'Exceções de expedição' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Pedidos parados, onde estão e há quanto tempo.'),
    ).toBeVisible()
  },
}

export const PeriodSelectCallsOnPeriodChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Período' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Últimos 30 dias' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledWith('30d')
  },
}

export const ExportCallsOnExport: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exportar' }),
    )
    await expect(args.onExport).toHaveBeenCalledTimes(1)
  },
}

export const HeaderToolsRenderOnlyWithTheirCallbacks: Story = {
  render: () => <Dashboard1 {...baseProps} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('navigation')).toBeNull()
    await expect(canvas.queryByRole('combobox')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Exportar' })).toBeNull()
  },
}

export const KpisShowFormattedValuesAndDeltas: Story = {
  play: async ({ canvasElement }) => {
    const open = canvasElement.querySelector('[data-kpi="open"]')
    await expect(open).toHaveTextContent('128')
    await expect(open).toHaveTextContent('-8%')
    await expect(
      canvasElement.querySelector('[data-kpi="sla"]'),
    ).toHaveTextContent('94,3%')
    await expect(
      canvasElement.querySelector('[data-kpi="risk"]'),
    ).toHaveTextContent('R$ 184.500')
  },
}

export const ChartsHaveNamesAndTextSummaries: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('img', {
        name: 'Capacidade utilizada por centro de distribuição',
      }),
    ).toHaveAccessibleDescription(/Campinas: 820 de 1\.000.*Recife: 790 de 800/)
    await expect(
      canvas.getByRole('img', { name: 'Exceções por motivo' }),
    ).toHaveAccessibleDescription(/Endereço: 46.*Pagamento: 20/)
  },
}

export const ReasonsChartDropsWithoutReasons: Story = {
  render: () => <Dashboard1 {...baseProps} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('img', { name: 'Exceções por motivo' }),
    ).toBeNull()
  },
}

export const TableListsEveryExceptionItReceives: Story = {
  render: () => <Dashboard1 {...baseProps} reasons={reasons} />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Exceções abertas',
    })
    await expect(within(table).getAllByRole('row')).toHaveLength(
      exceptions.length + 1,
    )
    await expect(
      canvasElement.querySelector('[data-exception="e1"]'),
    ).toHaveTextContent('26 h')
    await expect(
      canvasElement.querySelector('[data-exception="e2"] [data-slot="badge"]'),
    ).toHaveTextContent('Escalada')
  },
}

export const FilterShowsCountsAndCallsOnFilterChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Todas 6' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Escaladas 2' }))
    await expect(args.onFilterChange).toHaveBeenCalledWith('Escalada')
    const table = canvas.getByRole('table', { name: 'Exceções abertas' })
    await expect(within(table).getAllByRole('row')).toHaveLength(3)
    await expect(canvas.queryByText('PED-48213')).toBeNull()
  },
}

export const SearchCallsOnSearchChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar pedido' }),
      'Manaus',
    )
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('Manaus')
    await expect(canvas.getByText('PED-48090')).toBeVisible()
    await expect(canvas.queryByText('PED-48213')).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Todas 1' })).toBeVisible()
  },
}

export const PaginationCallsOnPageChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const pages = canvas.getByRole('navigation', {
      name: 'Paginação das exceções',
    })
    await expect(pages).toHaveTextContent('Página 1 de 2')
    await expect(
      within(pages).getByRole('button', { name: 'Página anterior' }),
    ).toBeDisabled()
    await userEvent.click(
      within(pages).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(pages).toHaveTextContent('Página 2 de 2')
    await expect(canvas.getByText('PED-48268')).toBeVisible()
  },
}

export const RowMenuCallsOnRowActionWithTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de PED-48213' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Escalar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('escalate', 'e1')
  },
}

export const TableToolsRenderOnlyWithTheirCallbacks: Story = {
  args: { tableTools: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(
      canvas.queryByRole('navigation', { name: 'Paginação das exceções' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Ações de PED-48213' }),
    ).toBeNull()
  },
}

export const NoRowsShowMessageInsideTable: Story = {
  render: () => (
    <Dashboard1 {...baseProps} exceptions={[]} filter="Resolvida" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhuma exceção para este filtro'),
    ).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
  },
}

export const EmptyShowsEmptyStateAndHidesExport: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma exceção de expedição')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Exportar' })).toBeNull()
    await expect(
      canvas.getByRole('combobox', { name: 'Período' }),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando exceções de expedição'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Exceções de expedição')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as exceções'),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exportar' })).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard1 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => (
    <Dashboard1
      {...baseProps}
      capacity={[]}
      error
      exceptions={[]}
      kpis={[]}
      pending
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando exceções de expedição'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => (
    <Dashboard1 {...baseProps} capacity={[]} error exceptions={[]} kpis={[]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma exceção de expedição')).toBeNull()
  },
}

export const LocaleAndCurrencyFormatValues: Story = {
  render: () => <Dashboard1 {...baseProps} currency="USD" locale="en-US" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-kpi="risk"]'),
    ).toHaveTextContent('$184,500')
    await expect(
      canvasElement.querySelector('[data-kpi="sla"]'),
    ).toHaveTextContent('94.3%')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard1
      {...baseProps}
      labels={{
        columnOrder: 'Order',
        delay: (hours) => `${hours} hours`,
        exceptionsTitle: 'Open exceptions',
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Open exceptions' })
    await expect(within(table).getByText('Order')).toBeVisible()
    await expect(canvas.getByText('26 hours')).toBeVisible()
  },
}
