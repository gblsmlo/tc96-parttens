import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard2 } from '@tc96/ui/blocks/application/dashboard/dashboard-2'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  channels,
  initialSort,
  kpis,
  orders,
  sales,
} from '../fixtures/dashboard-2.ts'
import {
  type Dashboard2Controls,
  dashboard2ControlArgs,
} from './dashboard-2-controls.ts'
import { ComposedDashboard2 } from './dashboard-2-layouts.tsx'

const meta = {
  args: {
    ...dashboard2ControlArgs,
    onExport: fn(),
    onPageChange: fn(),
    onPeriodChange: fn(),
    onRetry: fn(),
    onRowAction: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard2/Behavior',
} satisfies Meta<
  Dashboard2Controls & {
    onExport: () => void
    onPageChange: (page: number) => void
    onPeriodChange: (period: string) => void
    onRetry: () => void
    onRowAction: (actionId: string, orderId: string) => void
    onSearchChange: (search: string) => void
    onSortChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const baseProps = {
  channels,
  kpis,
  onSortChange: () => undefined,
  orders,
  sales,
  sort: initialSort,
}

const rowNumbers = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('[data-order]')).map(
    (row) => row.querySelector('td')?.textContent,
  )

export const KpisShowFormattedValuesAndDeltas: Story = {
  play: async ({ canvasElement }) => {
    const revenue = canvasElement.querySelector('[data-kpi="revenue"]')
    await expect(revenue).toHaveTextContent('R$ 482.300')
    await expect(revenue).toHaveTextContent('+8,4%')
    await expect(
      canvasElement.querySelector('[data-kpi="orders"]'),
    ).toHaveTextContent('3.128')
  },
}

export const SparklinesAreDecorative: Story = {
  play: async ({ canvasElement }) => {
    const sparkline = canvasElement.querySelector(
      '[data-kpi="revenue"] svg.recharts-surface',
    )
    await expect(sparkline).not.toBeNull()
    await expect(sparkline?.closest('[aria-hidden="true"]')).not.toBeNull()
  },
}

export const SparklinesDropWhenNotGiven: Story = {
  args: { sparklines: false },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-kpi="revenue"] svg.recharts-surface'),
    ).toBeNull()
  },
}

export const SalesChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    const chart = within(canvasElement).getByRole('img', {
      name: 'Vendas por canal ao longo do período',
    })
    await expect(chart).toHaveAccessibleDescription(/Seg: R\$\s23\.100.*Dom/)
  },
}

export const HeaderShowsBreadcrumbPeriodAndExport: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      within(
        canvas.getByRole('navigation', { name: 'Navegação estrutural' }),
      ).getByRole('link', { name: 'Início' }),
    ).toHaveAttribute('href', '/')
    await userEvent.click(canvas.getByRole('combobox', { name: 'Período' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Este trimestre' }),
    )
    await expect(args.onPeriodChange).toHaveBeenCalledWith('quarter')
    await userEvent.click(canvas.getByRole('button', { name: 'Exportar' }))
    await expect(args.onExport).toHaveBeenCalledTimes(1)
  },
}

export const MixChartHasNameAndTextSummary: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Participação de cada canal na receita do período',
      }),
    ).toHaveAccessibleDescription(
      /Loja física: R\$\s?77\.900.*Marketplace: R\$\s?51\.300/,
    )
  },
}

export const PlanLineJoinsTheLegendOnlyWithAPlan: Story = {
  render: () => (
    <Dashboard2
      {...baseProps}
      sales={sales.map(({ plan: _plan, ...point }) => point)}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText('Plano')).toBeNull()
  },
}

export const SearchCallsOnSearchChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar pedido ou cliente' }),
      'Caio',
    )
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('Caio')
    await expect(rowNumbers(canvasElement)).toEqual(['#10479'])
  },
}

export const PaginationCallsOnPageChange: Story = {
  play: async ({ args, canvasElement }) => {
    const pages = within(canvasElement).getByRole('navigation', {
      name: 'Paginação dos pedidos',
    })
    await expect(pages).toHaveTextContent('Página 1 de 2')
    await userEvent.click(
      within(pages).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(rowNumbers(canvasElement)).toEqual(['#10478'])
    await expect(
      within(pages).getByRole('button', { name: 'Próxima página' }),
    ).toBeDisabled()
  },
}

export const RowMenuCallsOnRowActionWithTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de #10482' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Reembolsar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('refund', 'o1')
  },
}

export const TableToolsRenderOnlyWithTheirCallbacks: Story = {
  args: { tableTools: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('searchbox')).toBeNull()
    await expect(
      canvas.queryByRole('navigation', { name: 'Paginação dos pedidos' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Ações de #10482' }),
    ).toBeNull()
    await expect(rowNumbers(canvasElement)).toHaveLength(orders.length)
  },
}

export const OrdersTableShowsStatusAndTotal: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-order="o1"]')
    await expect(row).toHaveTextContent('Helena Prado')
    await expect(row).toHaveTextContent('R$ 389,90')
    await expect(row?.querySelector('[data-slot="badge"]')).toHaveTextContent(
      'Pago',
    )
  },
}

export const ActiveColumnShowsAriaSort: Story = {
  play: async ({ canvasElement }) => {
    const headers = within(canvasElement).getAllByRole('columnheader')
    await expect(
      headers.find((header) => header.textContent === 'Data'),
    ).toHaveAttribute('aria-sort', 'descending')
    await expect(
      headers.find((header) => header.textContent === 'Total'),
    ).toHaveAttribute('aria-sort', 'none')
  },
}

export const SortButtonCallsOnSortChange: Story = {
  render: (args) => (
    <Dashboard2 {...baseProps} onSortChange={args.onSortChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Total' }),
    )
    await expect(args.onSortChange).toHaveBeenCalledWith({
      direction: 'asc',
      key: 'total',
    })
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Data' }),
    )
    await expect(args.onSortChange).toHaveBeenLastCalledWith({
      direction: 'asc',
      key: 'placedAt',
    })
  },
}

export const SortIsControlledByTheConsumer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(rowNumbers(canvasElement)[0]).toBe('#10482')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Cliente' }),
    )
    await expect(rowNumbers(canvasElement)[0]).toBe('#10478')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ordenar por Cliente' }),
    )
    await expect(rowNumbers(canvasElement)[0]).toBe('#10481')
  },
}

export const BlockDoesNotSortRows: Story = {
  render: () => (
    <Dashboard2 {...baseProps} sort={{ direction: 'asc', key: 'total' }} />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowNumbers(canvasElement)[0]).toBe('#10482')
  },
}

export const NoOrdersShowMessageInsideTable: Story = {
  render: () => <Dashboard2 {...baseProps} orders={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum pedido no período'),
    ).toBeVisible()
  },
}

export const EmptyShowsEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma venda registrada')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando receita do varejo'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Receita do varejo')).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as vendas'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Dashboard2 {...baseProps} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => (
    <Dashboard2 {...baseProps} error kpis={[]} orders={[]} pending sales={[]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando receita do varejo'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => (
    <Dashboard2 {...baseProps} error kpis={[]} orders={[]} sales={[]} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma venda registrada')).toBeNull()
  },
}

export const LocaleAndCurrencyFormatValues: Story = {
  render: () => <Dashboard2 {...baseProps} currency="USD" locale="en-US" />,
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-kpi="revenue"]'),
    ).toHaveTextContent('$482,300')
    await expect(
      canvasElement.querySelector('[data-order="o1"]'),
    ).toHaveTextContent('$389.90')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Dashboard2
      {...baseProps}
      labels={{ columnTotal: 'Amount', ordersTitle: 'Latest orders' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('table', { name: 'Latest orders' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Ordenar por Amount' }),
    ).toBeVisible()
  },
}
