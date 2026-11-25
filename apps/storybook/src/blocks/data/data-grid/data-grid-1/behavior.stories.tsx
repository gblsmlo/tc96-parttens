import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid1 } from '@tc96/ui/blocks/data/data-grid/data-grid-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { tickets, views } from '../fixtures/data-grid-1.ts'
import {
  type DataGrid1Controls,
  dataGrid1ControlArgs,
} from './data-grid-1-controls.ts'
import { ComposedDataGrid1 } from './data-grid-1-layouts.tsx'

const retry = fn()

const meta = {
  args: {
    ...dataGrid1ControlArgs,
    onAssignOwner: fn(),
    onColumnVisibilityChange: fn(),
    onCreate: fn(),
    onExport: fn(),
    onPageSizeChange: fn(),
    onQueueChange: fn(),
    onRowAction: fn(),
    onSaveView: fn(),
    onSelectedIdsChange: fn(),
    onSortChange: fn(),
    onStatusChange: fn(),
    onStatusUpdate: fn(),
    onViewChange: fn(),
    onViewCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid1/Behavior',
} satisfies Meta<
  DataGrid1Controls & {
    onAssignOwner: () => void
    onColumnVisibilityChange: () => void
    onCreate: () => void
    onExport: () => void
    onPageSizeChange: () => void
    onQueueChange: () => void
    onRowAction: () => void
    onSaveView: () => void
    onSelectedIdsChange: () => void
    onSortChange: () => void
    onStatusChange: () => void
    onStatusUpdate: () => void
    onViewChange: () => void
    onViewCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const rowsOf = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('[data-slot="data-grid-row"]'))

const headerOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles da fila de suporte',
  })

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const openDisplayMenu = async (
  canvasElement: HTMLElement,
  name = 'Exibição',
) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name }))
  return screen.findByRole('menu')
}

const chooseFilter = async (
  canvasElement: HTMLElement,
  submenu: string,
  option: string,
) => {
  const menu = await openDisplayMenu(canvasElement)
  await userEvent.click(within(menu).getByRole('menuitem', { name: submenu }))
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: option }),
  )
  return menu
}

const selectTicket = (canvasElement: HTMLElement, code: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', { name: `Selecionar ${code}` }),
  )

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      canvas.getByRole('button', { name: 'Todos os chamados' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Fila de suporte' }),
    ).toBeVisible()
  },
}

export const TheToolbarCarriesTheViewSwitcherAndTheControls: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = headerOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('button', { name: 'Todos os chamados' }),
    ).toBeVisible()
    await expect(inToolbar.queryByRole('searchbox')).toBeNull()
    await expect(
      inToolbar.getByRole('button', { name: 'Exibição' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Novo chamado' }),
    ).toBeVisible()
  },
}

export const EachRowShowsTheTicketDetails: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(rowsOf(canvasElement)).toHaveLength(6)
    await expect(first).toHaveTextContent('SUP-1831')
    await expect(first).toHaveTextContent('Aberto há 2 h')
    await expect(first).toHaveTextContent('Teodoro Vieira')
    await expect(first).toHaveTextContent('Frota Atlas')
    await expect(first).toHaveTextContent('Plataforma')
    await expect(first).toHaveTextContent('Urgente')
    await expect(first).toHaveTextContent('Estourado há 14 min')
    await expect(first).toHaveTextContent('Pendente')
  },
}

export const SlaToneAndStatusAreDataAttributes: Story = {
  play: async ({ canvasElement }) => {
    const first = rowsOf(canvasElement)[0] as HTMLElement
    await expect(first.querySelector('[data-sla]')).toHaveAttribute(
      'data-sla',
      'breached',
    )
    await expect(first.querySelector('[data-status]')).toHaveAttribute(
      'data-status',
      'pending',
    )
  },
}

export const TheSummaryCountsTheVisibleTickets: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    await expect(headerOf(canvasElement)).toHaveTextContent(
      '11 visíveis · 2 sem responsável · 6 perto do SLA',
    )
  },
}

export const TheQueueFilterNarrowsTheRows: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseFilter(canvasElement, 'Fila', 'Faturamento')
    await expect(args.onQueueChange).toHaveBeenLastCalledWith('billing')
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(3))
    await expect(canvasElement).toHaveTextContent('Exibição (1)')
  },
}

export const TheStatusFilterNarrowsTheRows: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseFilter(canvasElement, 'Status', 'Resolvido')
    await expect(args.onStatusChange).toHaveBeenLastCalledWith('resolved')
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(1))
  },
}

export const ClearFiltersResetsQueueAndStatus: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await chooseFilter(canvasElement, 'Fila', 'Faturamento')
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onQueueChange).toHaveBeenLastCalledWith(null)
    await expect(args.onStatusChange).toHaveBeenLastCalledWith(null)
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(6))
  },
}

export const TheColumnsSubmenuHidesAColumn: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openDisplayMenu(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Colunas' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Fila' }),
    )
    await waitFor(() =>
      expect(args.onColumnVisibilityChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ queue: false }),
      ),
    )
    await expect(
      within(canvasElement).queryByRole('columnheader', { name: /^Fila/ }),
    ).toBeNull()
  },
}

export const SaveViewCallsOnSaveView: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openDisplayMenu(canvasElement)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Salvar visão' }),
    )
    await expect(args.onSaveView).toHaveBeenCalledOnce()
  },
}

export const TheViewSwitcherReportsTheView: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Todos os chamados' }),
    )
    const dialog = await screen.findByRole('dialog', {
      name: 'Todos os chamados',
    })
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Urgentes' }),
    )
    await expect(args.onViewChange).toHaveBeenLastCalledWith('urgent')
    await waitFor(() =>
      expect(
        within(canvasElement).getByRole('button', { name: 'Urgentes' }),
      ).toBeVisible(),
    )
  },
}

export const WithoutViewsTheHeadingReturns: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Todos os chamados' }),
    ).toBeNull()
    const headings = canvas.getAllByRole('heading')
    await expect(headings).toHaveLength(1)
    await expect(headings[0]).toHaveTextContent('Fila de suporte')
    await expect(headings[0]?.tagName).toBe('H2')
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await selectTicket(canvasElement, 'SUP-1831')
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'sup-1831',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações dos chamados selecionados',
    })
    await expect(bar).toHaveTextContent('1 chamado selecionado')
    await selectTicket(canvasElement, 'SUP-1793')
    await waitFor(() =>
      expect(actionBarOf(canvasElement)).toHaveTextContent(
        '2 chamados selecionados',
      ),
    )
  },
}

export const SelectAllSelectsThePage: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('checkbox', {
        name: 'Selecionar todos os chamados da página',
      }),
    )
    await waitFor(() =>
      expect(actionBarOf(canvasElement)).toHaveTextContent(
        '6 chamados selecionados',
      ),
    )
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith(
      expect.arrayContaining(['sup-1831', 'sup-1793']),
    )
  },
}

const chooseInActionBar = async (
  canvasElement: HTMLElement,
  action: string,
  option: string,
) => {
  const bar = within(actionBarOf(canvasElement) as HTMLElement)
  await userEvent.click(bar.getByRole('button', { name: action }))
  await userEvent.click(await screen.findByRole('menuitem', { name: option }))
}

export const AssignOwnerListsTheOwnersAndReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTicket(canvasElement, 'SUP-1831')
    await selectTicket(canvasElement, 'SUP-1793')
    await chooseInActionBar(
      canvasElement,
      'Atribuir responsável',
      'Bianca Torres',
    )
    await expect(args.onAssignOwner).toHaveBeenCalledWith(
      ['sup-1831', 'sup-1793'],
      'bianca',
    )
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('SUP-1831')
  },
}

export const UpdateStatusListsTheStatusesAndReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTicket(canvasElement, 'SUP-1842')
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Atualizar status' }))
    const menu = await screen.findByRole('menu')
    await expect(within(menu).getByText('Novo status')).toBeVisible()
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3)
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Resolvido' }),
    )
    await expect(args.onStatusUpdate).toHaveBeenCalledWith(
      ['sup-1842'],
      'resolved',
    )
  },
}

export const ClearSelectionClosesTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTicket(canvasElement, 'SUP-1831')
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Limpar seleção' }))
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const ActionBarItemsNeedTheirCallbacks: Story = {
  args: { bulkActions: false },
  play: async ({ canvasElement }) => {
    await selectTicket(canvasElement, 'SUP-1831')
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(
      bar.queryByRole('button', { name: 'Atribuir responsável' }),
    ).toBeNull()
    await expect(
      bar.queryByRole('button', { name: 'Atualizar status' }),
    ).toBeNull()
    await expect(
      bar.getByRole('button', { name: 'Limpar seleção' }),
    ).toBeVisible()
  },
}

export const FooterPaginatesTheTickets: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–6 de 11')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(canvas.getByText('7–11 de 11')).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(5)
  },
}

export const RowsPerPageChangesThePageSize: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Linhas por página',
      }),
    )
    await userEvent.click(await screen.findByRole('option', { name: '12' }))
    await expect(args.onPageSizeChange).toHaveBeenLastCalledWith(12)
    await waitFor(() => expect(rowsOf(canvasElement)).toHaveLength(11))
    await expect(within(canvasElement).getByText('1–11 de 11')).toBeVisible()
  },
}

export const TheRowMenuReportsTheAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ações de SUP-1831' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Escalonar' }),
    )
    await expect(args.onRowAction).toHaveBeenCalledWith('escalate', 'sup-1831')
  },
}

export const HeaderButtonsCallTheirCallbacks: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Novo chamado' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Exportar CSV' }))
    await expect(args.onCreate).toHaveBeenCalledOnce()
    await expect(args.onExport).toHaveBeenCalledOnce()
  },
}

export const HeaderButtonsNeedTheirCallbacks: Story = {
  args: { headerActions: false, rowActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Novo chamado' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Ações de SUP-1831' }),
    ).toBeNull()
  },
}

export const TheConsumerControlsTheFilters: Story = {
  render: () => (
    <DataGrid1 queue="authentication" status="open" tickets={tickets} />
  ),
  play: async ({ canvasElement }) => {
    await expect(rowsOf(canvasElement)).toHaveLength(1)
    await expect(rowsOf(canvasElement)[0]).toHaveTextContent('SUP-1793')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <DataGrid1
      labels={{
        columns: { ticket: 'Solicitação' },
        summary: (visible) => `${visible} na fila`,
        title: 'Atendimento',
      }}
      tickets={tickets}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Atendimento' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: /Solicitação/ }),
    ).toBeVisible()
    await expect(headerOf(canvasElement)).toHaveTextContent('11 na fila')
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <DataGrid1 pending tickets={tickets} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando chamados')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Fila de suporte' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('heading')).toHaveLength(1)
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
    await expect(canvas.queryByRole('grid')).toBeNull()
  },
}

export const PendingKeepsTheViewSwitcher: Story = {
  render: () => (
    <DataGrid1 activeViewId="all" pending tickets={tickets} views={views} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando chamados')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Todos os chamados' }),
    ).toBeVisible()
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <DataGrid1 error onRetry={retry} tickets={tickets} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os chamados'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Fila de suporte' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <DataGrid1 error tickets={tickets} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <DataGrid1 error pending tickets={tickets} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando chamados')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os chamados'),
    ).toBeNull()
  },
}
