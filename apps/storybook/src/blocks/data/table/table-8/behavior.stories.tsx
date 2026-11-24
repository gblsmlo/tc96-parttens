import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table8 } from '@tc96/ui/blocks/data/table/table-8'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  emptyFilters,
  table8TotalCount,
  transactions,
} from '../fixtures/table-8.ts'
import { type Table8Controls, table8ControlArgs } from './table-8-controls.ts'
import { ComposedTable8 } from './table-8-layouts.tsx'

const retry = fn()
const loadMore = fn()
const exportAll = fn()

const meta = {
  args: {
    ...table8ControlArgs,
    onExport: fn(),
    onExportSelected: fn(),
    onFiltersChange: fn(),
    onFlag: fn(),
    onLoadMore: fn(),
    onRefresh: fn(),
    onRefund: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
    onViewChange: fn(),
    onViewCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table8/Behavior',
} satisfies Meta<
  Table8Controls & {
    onExport: () => void
    onExportSelected: () => void
    onFiltersChange: () => void
    onFlag: () => void
    onLoadMore: () => void
    onRefresh: () => void
    onRefund: () => void
    onSearchChange: () => void
    onSortChange: () => void
    onViewChange: () => void
    onViewCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const [first, second] = transactions as [
  (typeof transactions)[number],
  (typeof transactions)[number],
]

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="data-table"] tbody [data-slot="table-row"]:not([data-loading-more])',
    ),
  )

const tableOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('table', { name: 'Transações' })

const viewportOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>(
    '[data-slot="data-table-viewport"]',
  ) as HTMLElement

const scrollToEnd = (viewport: HTMLElement) => {
  viewport.scrollTop = viewport.scrollHeight
  viewport.dispatchEvent(new Event('scroll'))
}

const headerOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles das transações',
  })

const actionBarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).findByRole('toolbar', {
    name: 'Ações das transações selecionadas',
  })

const openViewSettings = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', {
      name: /^Configurações de visualização/,
    }),
  )
  return screen.findByRole('menu')
}

const openSubmenu = async (name: string) => {
  await userEvent.click(await screen.findByRole('menuitem', { name }))
}

export const EachRowShowsTheTransaction: Story = {
  play: async ({ canvasElement }) => {
    const row = rowsOf(canvasElement)[0] as HTMLElement
    await expect(row).toHaveTextContent(first.id)
    await expect(row).toHaveTextContent(first.chargeId)
    await expect(row).toHaveTextContent(first.customer.name)
    await expect(row).toHaveTextContent(first.customer.email)
    await expect(row).toHaveTextContent(`•••• ${first.lastFour}`)
  },
}

export const MethodAndRiskAreNamedForAssistiveTechnology: Story = {
  render: () => (
    <Table8
      totalCount={1}
      transactions={[{ ...first, lastFour: '4242', method: 'card', risk: 87 }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Cartão com final 4242')).toBeInTheDocument()
    await expect(canvas.getByText('Risco alto, 87')).toBeInTheDocument()
    await expect(
      canvasElement.querySelector('[data-risk="high"]'),
    ).toBeInTheDocument()
  },
}

export const StatusIsABadge: Story = {
  render: () => (
    <Table8
      totalCount={2}
      transactions={[
        { ...first, status: 'refunded' },
        { ...second, status: 'failed' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Estornada')).toBeVisible()
    await expect(canvas.getByText('Falhou')).toBeVisible()
  },
}

export const TheHeadingAppearsOnce: Story = {
  play: async ({ canvasElement }) => {
    const headings = within(canvasElement).getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Transações')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const TheToolbarCarriesTheHeadingAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = headerOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-variant', 'text')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('heading', { name: 'Transações' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Atualizar' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', {
        name: /^Configurações de visualização/,
      }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Exportar' }),
    ).toBeVisible()
  },
}

export const TheHeaderShowsLoadedOfTotal: Story = {
  play: async ({ canvasElement }) => {
    await expect(headerOf(canvasElement)).toHaveTextContent(
      '40 de 10.000 carregadas',
    )
  },
}

export const TheTableRendersEveryLoadedRowInABoundedViewport: Story = {
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(40)
    const viewport = viewportOf(canvasElement)
    await expect(viewport.clientHeight).toBeLessThanOrEqual(560)
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  },
}

export const ScrollingToTheEndLoadsMoreOnce: Story = {
  render: () => (
    <Table8
      hasMore
      onLoadMore={loadMore}
      totalCount={table8TotalCount}
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    loadMore.mockClear()
    const viewport = viewportOf(canvasElement)
    await expect(loadMore).not.toHaveBeenCalled()
    scrollToEnd(viewport)
    await waitFor(() => expect(loadMore).toHaveBeenCalledOnce())
    scrollToEnd(viewport)
    viewport.dispatchEvent(new Event('scroll'))
    await new Promise((resolve) => setTimeout(resolve, 200))
    await expect(loadMore).toHaveBeenCalledOnce()
  },
}

export const NoLoadMoreWithoutHasMore: Story = {
  render: () => (
    <Table8
      onLoadMore={loadMore}
      totalCount={transactions.length}
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    loadMore.mockClear()
    scrollToEnd(viewportOf(canvasElement))
    await new Promise((resolve) => setTimeout(resolve, 200))
    await expect(loadMore).not.toHaveBeenCalled()
  },
}

export const LoadingMoreAppendsSkeletonRows: Story = {
  play: async ({ args, canvasElement }) => {
    scrollToEnd(viewportOf(canvasElement))
    await waitFor(() => expect(args.onLoadMore).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(tableOf(canvasElement)).toHaveAttribute('aria-busy', 'true'),
    )
    await expect(
      canvasElement.querySelector('[data-loading-more="true"]'),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(headerOf(canvasElement)).toHaveTextContent(
        '80 de 10.000 carregadas',
      ),
    )
  },
}

export const RefreshSpinsWhileRefreshing: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', {
      name: 'Atualizar',
    })
    await userEvent.click(button)
    await expect(args.onRefresh).toHaveBeenCalledOnce()
    await expect(button).toHaveAttribute('aria-disabled', 'true')
    await expect(
      button.querySelector('[data-refreshing="true"]'),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(button).toHaveAttribute('aria-disabled', 'false'),
    )
  },
}

export const ExportCallsOnExport: Story = {
  render: () => (
    <Table8
      onExport={exportAll}
      totalCount={table8TotalCount}
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    exportAll.mockClear()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exportar' }),
    )
    await expect(exportAll).toHaveBeenCalledOnce()
  },
}

const selectTwo = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  await userEvent.click(
    canvas.getByRole('checkbox', { name: `Selecionar ${first.id}` }),
  )
  await userEvent.click(
    canvas.getByRole('checkbox', { name: `Selecionar ${second.id}` }),
  )
  return within(await actionBarOf(canvasElement))
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('toolbar', {
        name: 'Ações das transações selecionadas',
      }),
    ).toBeNull()
    await selectTwo(canvasElement)
    const bar = await actionBarOf(canvasElement)
    await expect(bar).toHaveAttribute('data-slot', 'action-bar')
    await expect(bar).toHaveTextContent(/2 selecionadas · Total de/)
  },
}

export const RefundReportsTheSelectedIds: Story = {
  play: async ({ args, canvasElement }) => {
    const bar = await selectTwo(canvasElement)
    await userEvent.click(bar.getByRole('button', { name: 'Estornar' }))
    await expect(args.onRefund).toHaveBeenCalledWith([first.id, second.id])
  },
}

export const FlagReportsTheSelectedIds: Story = {
  play: async ({ args, canvasElement }) => {
    const bar = await selectTwo(canvasElement)
    await userEvent.click(bar.getByRole('button', { name: 'Sinalizar' }))
    await expect(args.onFlag).toHaveBeenCalledWith([first.id, second.id])
  },
}

export const ExportSelectedReportsTheSelectedIds: Story = {
  play: async ({ args, canvasElement }) => {
    const bar = await selectTwo(canvasElement)
    await userEvent.click(bar.getByRole('button', { name: 'Exportar' }))
    await expect(args.onExportSelected).toHaveBeenCalledWith([
      first.id,
      second.id,
    ])
    await expect(args.onExport).not.toHaveBeenCalled()
  },
}

export const ClearSelectionClosesTheActionBar: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('checkbox', { name: `Selecionar ${first.id}` }),
    )
    const bar = within(await actionBarOf(canvasElement))
    await userEvent.click(bar.getByRole('button', { name: 'Limpar seleção' }))
    await waitFor(() =>
      expect(
        canvas.queryByRole('toolbar', {
          name: 'Ações das transações selecionadas',
        }),
      ).toBeNull(),
    )
    await expect(
      canvas.getByRole('checkbox', { name: `Selecionar ${first.id}` }),
    ).not.toBeChecked()
  },
}

export const ActionBarItemsNeedTheirCallbacks: Story = {
  args: { bulkActions: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('checkbox', {
        name: `Selecionar ${first.id}`,
      }),
    )
    const bar = within(await actionBarOf(canvasElement))
    await expect(bar.queryByRole('button', { name: 'Estornar' })).toBeNull()
    await expect(bar.queryByRole('button', { name: 'Sinalizar' })).toBeNull()
    await expect(bar.queryByRole('button', { name: 'Exportar' })).toBeNull()
    await expect(
      bar.getByRole('button', { name: 'Limpar seleção' }),
    ).toBeVisible()
  },
}

export const SortReportsAndTheConsumerReorders: Story = {
  play: async ({ args, canvasElement }) => {
    await openViewSettings(canvasElement)
    await openSubmenu('Ordenar por')
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Valor: crescente' }),
    )
    await waitFor(() =>
      expect(args.onSortChange).toHaveBeenLastCalledWith({
        direction: 'asc',
        key: 'amount',
      }),
    )
  },
}

export const AFilterReportsTheFilters: Story = {
  play: async ({ args, canvasElement }) => {
    await openViewSettings(canvasElement)
    await openSubmenu('Status')
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Pendente' }),
    )
    await waitFor(() =>
      expect(args.onFiltersChange).toHaveBeenLastCalledWith({
        ...emptyFilters,
        status: 'pending',
      }),
    )
    await waitFor(() =>
      expect(
        within(canvasElement).getByRole('button', {
          name: /^Configurações de visualização/,
        }),
      ).toHaveTextContent('(1)'),
    )
  },
}

export const AColumnCanBeHidden: Story = {
  play: async ({ canvasElement }) => {
    await openViewSettings(canvasElement)
    await openSubmenu('Colunas')
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Risco' }),
    )
    await waitFor(() =>
      expect(
        within(canvasElement).queryByRole('columnheader', { name: /Risco/ }),
      ).toBeNull(),
    )
  },
}

export const SearchCommitsOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(canvasElement).getByRole('searchbox', {
      name: 'Buscar id, cliente ou cartão',
    })
    await userEvent.type(field, `${first.customer.name}{Enter}`)
    await expect(args.onSearchChange).toHaveBeenCalledWith(first.customer.name)
    await waitFor(() =>
      expect(rowsOf(canvasElement)[0]).toHaveTextContent(first.customer.name),
    )
  },
}

export const TheViewSwitcherReportsTheView: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Todas as transações',
      }),
    )
    const popup = await screen.findByRole('dialog', {
      name: 'Todas as transações',
    })
    await userEvent.click(
      within(popup).getByRole('button', { name: 'Risco alto' }),
    )
    await expect(args.onViewChange).toHaveBeenCalledWith('high-risk')
  },
}

export const TheViewSwitcherNeedsViews: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: 'Todas as transações',
      }),
    ).toBeNull()
  },
}

export const LocaleFormatsTheCounts: Story = {
  args: { locale: 'en-US' },
  play: async ({ canvasElement }) => {
    await expect(headerOf(canvasElement)).toHaveTextContent(
      '40 de 10,000 carregadas',
    )
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Table8
      labels={{
        columns: { customer: 'Pagador' },
        loaded: (loaded, total) => `${loaded} of ${total} loaded`,
        title: 'Livro-razão',
      }}
      onRefresh={() => undefined}
      totalCount={table8TotalCount}
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Livro-razão' }),
    ).toBeVisible()
    await expect(canvas.getByText('40 of 10.000 loaded')).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Pagador/ }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Atualizar' }),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => (
    <Table8 pending totalCount={table8TotalCount} transactions={transactions} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando transações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { name: 'Transações' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(canvas.queryByRole('button', { name: 'Atualizar' })).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: /^Configurações de visualização/ }),
    ).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => (
    <Table8
      error
      onRetry={retry}
      totalCount={table8TotalCount}
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as transações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Transações' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('table')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => (
    <Table8 error totalCount={table8TotalCount} transactions={transactions} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => (
    <Table8
      error
      pending
      totalCount={table8TotalCount}
      transactions={transactions}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando transações')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar as transações'),
    ).toBeNull()
  },
}
