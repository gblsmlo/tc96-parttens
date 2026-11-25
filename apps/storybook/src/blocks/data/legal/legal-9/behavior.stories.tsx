import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal9 } from '@tc96/ui/blocks/data/legal/legal-9'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { owners, records, savedViews } from '../fixtures/legal-9.ts'
import { type Legal9Controls, legal9ControlArgs } from './legal-9-controls.ts'
import { ComposedLegal9 } from './legal-9-layouts.tsx'

const callbacks = {
  onBillingModelChange: fn(),
  onBillingModelFilterChange: fn(),
  onBulkBillingModelChange: fn(),
  onBulkOwnerChange: fn(),
  onCollapsedGroupIdsChange: fn(),
  onCreate: fn(),
  onDefaultViewSelect: fn(),
  onGroupByChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onOwnerChange: fn(),
  onOwnerFilterChange: fn(),
  onPageChange: fn(),
  onRetry: fn(),
  onSavedViewCreate: fn(),
  onSavedViewSelect: fn(),
  onSavePreference: fn(),
  onSearchChange: fn(),
  onSelectedIdsChange: fn(),
  onSortChange: fn(),
  onStatusFilterChange: fn(),
}

const meta = {
  args: { ...legal9ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal9/Behavior',
} satisfies Meta<Legal9Controls & Record<keyof typeof callbacks, () => void>>

export default meta

type Story = StoryObj<typeof meta>

const fixedTitle = 'Ação de cobrança contra fornecedor de farinha'
const subscriptionTitle = 'Assessoria trabalhista mensal'
const contingencyTitle = 'Revisional de aluguel comercial'
const closedTitle = 'Inventário de Lúcia Meireles'
const noModelTitle = 'Parecer sobre contrato de franquia'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles de contratos',
  })

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, title: string) =>
  within(canvasElement).getByText(title).closest('tr') as HTMLElement

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  option: string,
) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: option }),
  )
}

const openViews = async (canvasElement: HTMLElement, current: string) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: current }),
  )
  const item = await screen.findByRole('button', {
    name: 'Padrão, 12 contratos',
  })
  await waitFor(() => expect(item).toBeVisible())
  return item
}

const pick = async (trigger: HTMLElement, option: string) => {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name: option }))
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

const selectRecord = (canvasElement: HTMLElement, title: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', {
      name: `Selecionar ${title}`,
    }),
  )

const chooseInActionBar = async (
  canvasElement: HTMLElement,
  action: string,
  option: string,
) => {
  const bar = within(actionBarOf(canvasElement) as HTMLElement)
  await userEvent.click(bar.getByRole('button', { name: action }))
  await userEvent.click(await screen.findByRole('menuitem', { name: option }))
}

export const SavedViewsReplaceTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Padrão' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Contratos' }),
    ).toBeVisible()
  },
}

export const WithoutSavedViewsTheHeadingNamesTheList: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'Contratos' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Padrão' })).toBeNull()
  },
}

export const TheDefaultViewShowsItsCount: Story = {
  play: async ({ canvasElement }) => {
    const item = await openViews(canvasElement, 'Padrão')
    await expect(
      item.querySelector('[data-slot="view-switcher-item-count"]'),
    ).toHaveTextContent('12')
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Padrão, 12 contratos' }),
      ).toBeNull(),
    )
  },
}

export const ChoosingASavedViewReportsItsId: Story = {
  play: async ({ args, canvasElement }) => {
    await openViews(canvasElement, 'Padrão')
    await userEvent.click(
      screen.getByRole('button', { name: 'Êxito em aberto' }),
    )
    await expect(args.onSavedViewSelect).toHaveBeenCalledWith('sv-1')
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Padrão, 12 contratos' }),
      ).toBeNull(),
    )
    await waitFor(() =>
      expect(
        within(toolbarOf(canvasElement)).getByRole('button', {
          name: 'Êxito em aberto',
        }),
      ).toBeVisible(),
    )
  },
}

export const TheDefaultViewReportsTheReset: Story = {
  play: async ({ args, canvasElement }) => {
    await openViews(canvasElement, 'Padrão')
    await userEvent.click(
      screen.getByRole('button', { name: 'Mensalidades da Beatriz' }),
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Padrão, 12 contratos' }),
      ).toBeNull(),
    )
    const item = await openViews(canvasElement, 'Mensalidades da Beatriz')
    await userEvent.click(item)
    await expect(args.onDefaultViewSelect).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Padrão, 12 contratos' }),
      ).toBeNull(),
    )
    await waitFor(() =>
      expect(
        within(toolbarOf(canvasElement)).getByRole('button', {
          name: 'Padrão',
        }),
      ).toBeVisible(),
    )
  },
}

export const SaveViewCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await openViews(canvasElement, 'Padrão')
    await userEvent.click(
      screen.getByRole('button', { name: 'Salvar visualização' }),
    )
    await expect(args.onSavedViewCreate).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Padrão, 12 contratos' }),
      ).toBeNull(),
    )
  },
}

export const SavePreferenceCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ModeTabsSwitchToTheList: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Lista' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('list')
    await closeMenus()
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-row"]'),
    ).toHaveLength(5)
  },
}

export const SortReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'Valor')
    await expect(args.onSortChange).toHaveBeenCalledWith('amount')
    await closeMenus()
    await expect(
      rowOf(canvasElement, 'Reorganização societária da clínica'),
    ).toBe(rowsOf(canvasElement)[0])
  },
}

export const GroupingByStatusGroupsTheTable: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Agrupar por', 'Status')
    await expect(args.onGroupByChange).toHaveBeenCalledWith('status')
    await closeMenus()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Recolher Ativo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Recolher Encerrado' }),
    ).toBeVisible()
  },
}

export const CollapsingAGroupReportsItsId: Story = {
  args: { groupBy: 'status' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher Encerrado' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:closed',
    ])
    await expect(
      canvas.getByRole('button', { name: 'Expandir Encerrado' }),
    ).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(closedTitle)).toBeNull()
  },
}

export const TheListGroupsByOwner: Story = {
  args: { groupBy: 'owner', mode: 'list' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Recolher Beatriz Nogueira' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Recolher Rafael Antunes' }),
    ).toBeVisible()
  },
}

export const StatusFilterReportsTheStatus: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Status', 'Encerrado')
    await expect(args.onStatusFilterChange).toHaveBeenCalledWith('closed')
    await closeMenus()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Exibição (1)',
      }),
    ).toBeVisible()
  },
}

export const BillingModelFilterReportsTheModel: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Modelo', 'Êxito')
    await expect(args.onBillingModelFilterChange).toHaveBeenCalledWith(
      'contingency',
    )
    await closeMenus()
  },
}

export const OwnerFilterReportsTheOwner: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Responsável', 'Rafael Antunes')
    await expect(args.onOwnerFilterChange).toHaveBeenCalledWith('rafael')
    await closeMenus()
  },
}

export const ClearFiltersResetsEveryFilter: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Status', 'Ativo')
    await closeMenus()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onStatusFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onBillingModelFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onOwnerFilterChange).toHaveBeenLastCalledWith(null)
    await expect(screen.getByRole('menu')).toBeVisible()
    await closeMenus()
  },
}

export const TheTableShowsTheContractColumns: Story = {
  args: { paginated: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of [
      'Nome',
      'Titular',
      'Modelo',
      'Status',
      'Valor',
      'Responsável',
    ])
      await expect(canvas.getByRole('columnheader', { name })).toBeVisible()
    const fixed = within(rowOf(canvasElement, fixedTitle))
    await expect(fixed.getByText('Moinho Santa Clara Ltda.')).toBeVisible()
    await expect(fixed.getByText(/15\.000,00/)).toBeVisible()
    await expect(fixed.getByText('Ativo')).toBeVisible()
    await expect(
      within(rowOf(canvasElement, contingencyTitle)).getByText('Sem valor'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, noModelTitle)).getByText('Sem modelo'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, closedTitle)).getByText('Encerrado'),
    ).toBeVisible()
  },
}

export const TheAmountFollowsLocaleAndCurrency: Story = {
  render: () => (
    <Legal9
      currency="USD"
      locale="en-US"
      owners={owners}
      records={records.slice(0, 1)}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('$15,000.00')).toBeVisible()
  },
}

export const BillingModelSelectReportsTheChange: Story = {
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, fixedTitle)).getByRole('combobox', {
        name: 'Modelo: Valor fixo',
      }),
      'Mensalidade',
    )
    await expect(args.onBillingModelChange).toHaveBeenCalledWith(
      'ct-901',
      'subscription',
    )
  },
}

export const OwnerSelectReportsTheNewOwner: Story = {
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, fixedTitle)).getByRole('combobox', {
        name: 'Responsável: Beatriz Nogueira',
      }),
      'Thiago Freitas',
    )
    await expect(args.onOwnerChange).toHaveBeenCalledWith('ct-901', 'thiago')
  },
}

export const AClosedContractIsReadOnly: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, closedTitle)).queryByRole('combobox'),
    ).toBeNull()
    await expect(
      within(rowOf(canvasElement, fixedTitle)).getAllByRole('combobox'),
    ).toHaveLength(2)
  },
}

export const WithoutEditCallbacksEveryRowIsReadOnly: Story = {
  args: { editable: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, fixedTitle)).queryByRole('combobox'),
    ).toBeNull()
  },
}

export const ARowOpensTheRecord: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir ${fixedTitle}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('ct-901')
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await selectRecord(canvasElement, fixedTitle)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith(['ct-901'])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações dos contratos selecionados',
    })
    await expect(bar).toHaveTextContent('1 selecionado')
  },
}

export const BulkOwnerSkipsClosedContracts: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, fixedTitle)
    await selectRecord(canvasElement, closedTitle)
    await chooseInActionBar(canvasElement, 'Responsável', 'Camila Duarte')
    await expect(args.onBulkOwnerChange).toHaveBeenCalledWith(
      ['ct-901'],
      'camila',
    )
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkBillingModelReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, subscriptionTitle)
    await chooseInActionBar(canvasElement, 'Modelo', 'Por hora')
    await expect(args.onBulkBillingModelChange).toHaveBeenCalledWith(
      ['ct-902'],
      'hourly',
    )
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkActionsWaitForAnEditableContract: Story = {
  play: async ({ canvasElement }) => {
    await selectRecord(canvasElement, closedTitle)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(
      bar.getByRole('button', { name: 'Responsável' }),
    ).toBeDisabled()
    await expect(bar.getByRole('button', { name: 'Modelo' })).toBeDisabled()
  },
}

export const ClearSelectionClosesTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, fixedTitle)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Limpar seleção' }))
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const WithoutBulkCallbacksThereIsNoSelection: Story = {
  args: { bulkActions: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('checkbox')).toHaveLength(
      0,
    )
  },
}

export const SearchReportsTheTextOnSubmit: Story = {
  args: { search: true },
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar contratos',
    })
    await userEvent.type(field, 'franquia')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('franquia')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const WithoutSearchCallbackThereIsNoSearchField: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(toolbarOf(canvasElement)).queryByRole('searchbox'),
    ).toBeNull()
  },
}

export const PaginationReportsTheNextPage: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de contratos' }),
      ).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('6–10 de 12')).toBeVisible()
  },
}

export const WithoutPageCountThereIsNoFooter: Story = {
  args: { paginated: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('navigation', {
        name: 'Paginação de contratos',
      }),
    ).toBeNull()
    await expect(rowsOf(canvasElement)).toHaveLength(records.length)
  },
}

export const TheEmptyMessageSaysThereAreNoContracts: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum contrato ainda.'),
    ).toBeVisible()
  },
}

export const TheEmptyMessageNamesTheFilters: Story = {
  render: () => <Legal9 filtered owners={owners} records={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum contrato com esses filtros.'),
    ).toBeVisible()
  },
}

export const CreateCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Novo contrato',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal9 pending records={records} savedViews={savedViews} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contratos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Padrão' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal9 error onRetry={args.onRetry} records={[]} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível listar os contratos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
