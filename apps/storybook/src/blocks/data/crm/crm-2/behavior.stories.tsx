import type { Meta, StoryObj } from '@storybook/react-vite'
import { Crm2, type Crm2Lead } from '@tc96/ui/blocks/data/crm/crm-2'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { leads, owners, stages, tags } from '../fixtures/crm-2.ts'
import { type Crm2Controls, crm2ControlArgs } from './crm-2-controls.ts'
import { ComposedCrm2 } from './crm-2-layouts.tsx'

const callbacks = {
  onArchivedFilterChange: fn(),
  onBulkArchive: fn(),
  onBulkOwnerChange: fn(),
  onBulkStageChange: fn(),
  onCreate: fn(),
  onCreateInStage: fn(),
  onGroupByChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onOriginChange: fn(),
  onOriginFilterChange: fn(),
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
  onStageChange: fn(),
  onStageFilterChange: fn(),
  onTagFilterChange: fn(),
}

const meta = {
  args: { ...crm2ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCrm2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm2/Behavior',
} satisfies Meta<Crm2Controls & Record<keyof typeof callbacks, () => void>>

export default meta

type Story = StoryObj<typeof meta>

const firstLead = 'Implantação de ERP na Padaria Pão Dourado'
const overdueLead = 'Plano anual para a Clínica Sorriso Leve'
const noValueLead = 'Consultoria de marketing para o Café Serra Azul'
const lockedLead = 'Integração com marketplace da Loja Bela Casa'
const lostLead = 'Automação de cobranças da Distribuidora Norte'
const archivedLead = 'Site institucional do Hotel Mar Azul'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles de leads' })

const columnOf = (canvasElement: HTMLElement, name: RegExp) =>
  within(within(canvasElement).getByRole('region', { name }))

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, title: string) =>
  within(canvasElement).getByText(title).closest('tr') as HTMLElement

const dragOverlay = () => document.querySelector('[data-dnd-overlay]')

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  role: 'menuitemcheckbox' | 'menuitemradio',
  option: string,
) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(await screen.findByRole(role, { name: option }))
}

const pick = async (trigger: HTMLElement, option: string) => {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name: option }))
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

const selectLead = (canvasElement: HTMLElement, title: string) =>
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

const dragFirstCardOfNewContactsRight = async (canvasElement: HTMLElement) => {
  const column = columnOf(canvasElement, /^Novo contato/)
  column.getByRole('button', { name: 'Novo lead em Novo contato' }).focus()
  await userEvent.tab()
  await expect(
    column.getAllByRole('button', { name: /^Mover card / })[0],
  ).toHaveFocus()
  await userEvent.keyboard('[Space]')
  await waitFor(() => expect(dragOverlay()).not.toBeEmptyDOMElement())
  await userEvent.keyboard('[ArrowRight]')
  await userEvent.keyboard('[Space]')
  await waitFor(() => expect(dragOverlay()).toBeEmptyDOMElement())
}

export const TheBoardHasOneColumnPerActiveStage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const stage of stages.filter((item) => !item.inactive))
      await expect(
        canvas.getByRole('region', { name: new RegExp(`^${stage.label}`) }),
      ).toBeVisible()
    await expect(canvas.queryByRole('region', { name: /^Triagem/ })).toBeNull()
    await expect(canvas.queryByRole('table')).toBeNull()
  },
}

export const TheColumnTitleShowsTheStageValue: Story = {
  play: async ({ canvasElement }) => {
    const value = within(canvasElement)
      .getByRole('region', { name: /^Negociação/ })
      .querySelector('[data-slot="crm-2-column-value"]')
    await expect(value).toHaveTextContent('R$ 93.000,00')
  },
}

export const TheBoardLeavesOutClosedAndArchivedLeads: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: `Abrir ${firstLead}` }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: `Abrir ${lostLead}` }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: `Abrir ${archivedLead}` }),
    ).toBeNull()
  },
}

export const ACardOpensTheLead: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir ${firstLead}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('lead-201')
  },
}

export const AColumnStartsANewLeadOnItsStage: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      columnOf(canvasElement, /^Proposta enviada/).getByRole('button', {
        name: 'Novo lead em Proposta enviada',
      }),
    )
    await expect(args.onCreateInStage).toHaveBeenCalledWith('proposta')
  },
}

export const DroppingACardReportsTheStage: Story = {
  play: async ({ args, canvasElement }) => {
    await dragFirstCardOfNewContactsRight(canvasElement)
    await expect(args.onStageChange).toHaveBeenCalledOnce()
    await expect(args.onStageChange).toHaveBeenCalledWith(
      'lead-204',
      'qualificacao',
    )
    await waitFor(() =>
      expect(
        columnOf(canvasElement, /^Qualificação/).getByRole('button', {
          name: `Abrir ${noValueLead}`,
        }),
      ).toBeVisible(),
    )
  },
}

const lockedOnNewContact: Crm2Lead[] = [
  {
    ...(leads.find((lead) => lead.id === 'lead-207') as Crm2Lead),
    stageId: 'novo',
  },
]

export const ALeadThatCannotBeEditedStaysInItsColumn: Story = {
  render: (args) => (
    <Crm2
      leads={lockedOnNewContact}
      onCreateInStage={args.onCreateInStage}
      onOpen={args.onOpen}
      onStageChange={args.onStageChange}
      owners={owners}
      stages={stages}
      tags={tags}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await dragFirstCardOfNewContactsRight(canvasElement)
    await expect(args.onStageChange).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(
        columnOf(canvasElement, /^Novo contato/).getByRole('button', {
          name: `Abrir ${lockedLead}`,
        }),
      ).toBeVisible(),
    )
  },
}

export const GroupingByOwnerDropsTheStageActions: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Agrupar por',
      'menuitemradio',
      'Responsável',
    )
    await expect(args.onGroupByChange).toHaveBeenCalledWith('owner')
    await closeMenus()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: /^Marina Costa/ }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: /^Sem responsável/ }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: /^Novo lead em / }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: /^Mover card / }),
    ).toBeNull()
  },
}

export const TheBoardHidesSortAndArchived: Story = {
  play: async ({ canvasElement }) => {
    const menu = within(await openDisplayMenu(canvasElement))
    await expect(
      menu.getByRole('menuitem', { name: 'Agrupar por' }),
    ).toBeVisible()
    await expect(
      menu.queryByRole('menuitem', { name: 'Ordenar por' }),
    ).toBeNull()
    await expect(
      menu.queryByRole('menuitem', { name: 'Arquivados' }),
    ).toBeNull()
    await closeMenus()
  },
}

export const TheTableHidesTheGrouping: Story = {
  args: { mode: 'table' },
  play: async ({ canvasElement }) => {
    const menu = within(await openDisplayMenu(canvasElement))
    await expect(
      menu.getByRole('menuitem', { name: 'Ordenar por' }),
    ).toBeVisible()
    await expect(
      menu.getByRole('menuitem', { name: 'Arquivados' }),
    ).toBeVisible()
    await expect(
      menu.queryByRole('menuitem', { name: 'Agrupar por' }),
    ).toBeNull()
    await closeMenus()
  },
}

export const TheBoardNoticeSaysSomeStagesHoldMore: Story = {
  args: { boardHasMore: true },
  play: async ({ canvasElement }) => {
    const notice = within(canvasElement)
      .getByText(/^Algumas etapas mostram só os primeiros leads/)
      .closest('[data-slot="alert"]')
    await expect(notice).toHaveAttribute('role', 'status')
  },
}

export const ModeTabsSwitchToTheTable: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Tabela' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('table')
    await closeMenus()
    const table = within(canvasElement).getByRole('table')
    for (const header of [
      'Lead',
      'Contato',
      'Etapa',
      'Origem',
      'Responsável',
      'Valor',
      'Próxima ação',
      'Prazo',
      'Tags',
    ])
      await expect(
        within(table).getByRole('columnheader', { name: header }),
      ).toBeVisible()
  },
}

export const ARowOpensTheLead: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir ${firstLead}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('lead-201')
  },
}

export const StageSelectOffersTheActiveStages: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, firstLead))
    await userEvent.click(
      row.getByRole('combobox', { name: 'Etapa: Qualificação' }),
    )
    await expect(
      await screen.findByRole('option', { name: 'Negociação' }),
    ).toBeVisible()
    await expect(screen.queryByRole('option', { name: 'Triagem' })).toBeNull()
    await userEvent.click(
      screen.getByRole('option', { name: 'Reunião agendada' }),
    )
    await expect(args.onStageChange).toHaveBeenCalledWith('lead-201', 'reuniao')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const ClosedAndLockedLeadsKeepTheirStage: Story = {
  args: { mode: 'table', paginated: false },
  play: async ({ canvasElement }) => {
    const locked = within(rowOf(canvasElement, lockedLead))
    await expect(locked.queryByRole('combobox', { name: /^Etapa/ })).toBeNull()
    await expect(locked.queryByRole('combobox', { name: /^Origem/ })).toBeNull()
    const lost = within(rowOf(canvasElement, lostLead))
    await expect(lost.queryByRole('combobox', { name: /^Etapa/ })).toBeNull()
    await expect(lost.getByText('Triagem')).toBeVisible()
    await expect(
      lost.getByRole('combobox', { name: 'Origem: Indicação' }),
    ).toBeVisible()
  },
}

export const OwnerSelectReportsTheNewOwner: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, firstLead)).getByRole('combobox', {
        name: 'Responsável: Marina Costa',
      }),
      'Ana Ribeiro',
    )
    await expect(args.onOwnerChange).toHaveBeenCalledWith('lead-201', 'ana')
  },
}

export const OriginSelectReportsTheNewOrigin: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, firstLead)).getByRole('combobox', {
        name: 'Origem: Indicação',
      }),
      'Evento',
    )
    await expect(args.onOriginChange).toHaveBeenCalledWith('lead-201', 'event')
  },
}

export const ReadOnlyHasNoEditableCell: Story = {
  args: { editable: false, mode: 'table' },
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, firstLead)).queryByRole('combobox'),
    ).toBeNull()
  },
}

export const TheValueFollowsTheCurrency: Story = {
  args: { mode: 'table' },
  play: async ({ canvasElement }) => {
    await expect(
      rowOf(canvasElement, firstLead).querySelector(
        '[data-slot="crm-2-value"]',
      ),
    ).toHaveTextContent('R$ 18.500,00')
    await expect(
      within(rowOf(canvasElement, noValueLead)).getByText('Sem valor'),
    ).toBeVisible()
  },
}

export const AnOverdueNextActionIsMarked: Story = {
  args: { mode: 'table' },
  play: async ({ canvasElement }) => {
    await expect(
      rowOf(canvasElement, overdueLead).querySelector('[data-overdue]'),
    ).not.toBeNull()
    await expect(
      rowOf(canvasElement, firstLead).querySelector('[data-overdue]'),
    ).toBeNull()
    await expect(
      within(rowOf(canvasElement, noValueLead)).getByText('Sem próxima ação'),
    ).toBeVisible()
  },
}

export const SearchReportsTheTextOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar leads',
    })
    await userEvent.type(field, 'farmavida')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('farmavida')
  },
}

export const SortReportsTheChoice: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Ordenar por',
      'menuitemradio',
      'Maior valor',
    )
    await expect(args.onSortChange).toHaveBeenCalledWith('value')
    await closeMenus()
  },
}

export const StageFilterReportsTheStage: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Etapa',
      'menuitemradio',
      'Proposta enviada',
    )
    await expect(args.onStageFilterChange).toHaveBeenCalledWith('proposta')
    await closeMenus()
  },
}

export const OwnerFilterReportsTheOwner: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Responsável',
      'menuitemradio',
      'Lucas Almeida',
    )
    await expect(args.onOwnerFilterChange).toHaveBeenCalledWith('lucas')
    await closeMenus()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Exibição (1)',
      }),
    ).toBeVisible()
  },
}

export const OriginFilterReportsTheOrigin: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Origem', 'menuitemradio', 'Indicação')
    await expect(args.onOriginFilterChange).toHaveBeenCalledWith('referral')
    await closeMenus()
  },
}

export const TagFilterReportsTheCheckedTags: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tags', 'menuitemcheckbox', 'Quente')
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith(['quente'])
    await closeMenus()
  },
}

export const ArchivedFilterReportsTheChoice: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Arquivados',
      'menuitemradio',
      'Só arquivados',
    )
    await expect(args.onArchivedFilterChange).toHaveBeenCalledWith('only')
    await closeMenus()
    await waitFor(() =>
      expect(within(canvasElement).getByText(archivedLead)).toBeVisible(),
    )
  },
}

export const ClearFiltersResetsEveryFilter: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Responsável',
      'menuitemradio',
      'Lucas Almeida',
    )
    await closeMenus()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onOwnerFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onStageFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith([])
    await closeMenus()
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await selectLead(canvasElement, firstLead)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'lead-201',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações dos leads selecionados',
    })
    await expect(bar).toHaveTextContent('1 selecionado')
  },
}

export const BulkStageMovesOnlyOpenLeads: Story = {
  args: { mode: 'table', paginated: false },
  play: async ({ args, canvasElement }) => {
    await selectLead(canvasElement, firstLead)
    await selectLead(canvasElement, lostLead)
    await chooseInActionBar(canvasElement, 'Mover para etapa', 'Negociação')
    await expect(args.onBulkStageChange).toHaveBeenCalledWith(
      ['lead-201'],
      'negociacao',
    )
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkStageNeedsAnOpenLead: Story = {
  args: { mode: 'table', paginated: false },
  play: async ({ canvasElement }) => {
    await selectLead(canvasElement, lostLead)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(
      bar.getByRole('button', { name: 'Mover para etapa' }),
    ).toBeDisabled()
    await expect(bar.getByRole('button', { name: 'Arquivar' })).toBeEnabled()
  },
}

export const BulkOwnerReportsTheEditableLeads: Story = {
  args: { mode: 'table', paginated: false },
  play: async ({ args, canvasElement }) => {
    await selectLead(canvasElement, firstLead)
    await selectLead(canvasElement, lockedLead)
    await chooseInActionBar(canvasElement, 'Responsável', 'Ana Ribeiro')
    await expect(args.onBulkOwnerChange).toHaveBeenCalledWith(
      ['lead-201'],
      'ana',
    )
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const ALockedSelectionHasNoBulkAction: Story = {
  args: { mode: 'table', paginated: false },
  play: async ({ canvasElement }) => {
    await selectLead(canvasElement, lockedLead)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(bar.queryByRole('button', { name: 'Responsável' })).toBeNull()
    await expect(bar.queryByRole('button', { name: 'Arquivar' })).toBeNull()
    await expect(
      bar.getByRole('button', { name: 'Limpar seleção' }),
    ).toBeVisible()
  },
}

export const BulkArchiveReportsTheIds: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await selectLead(canvasElement, firstLead)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Arquivar' }))
    await expect(args.onBulkArchive).toHaveBeenCalledWith(['lead-201'])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const ClearSelectionClosesTheActionBar: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    await selectLead(canvasElement, firstLead)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Limpar seleção' }))
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const WithoutBulkCallbacksThereIsNoSelection: Story = {
  args: { bulkActions: false, mode: 'table' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryAllByRole('checkbox')).toHaveLength(
      0,
    )
  },
}

export const PaginationReportsTheNextPage: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 11')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de leads' }),
      ).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('6–10 de 11')).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(5)
  },
}

export const TheBoardHasNoPagination: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('navigation', {
        name: 'Paginação de leads',
      }),
    ).toBeNull()
  },
}

export const SavedViewsReplaceTheHeading: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('heading', { level: 2, name: 'Leads' }),
    ).toBeNull()
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Todos os leads',
      }),
    )
    const views = await screen.findByRole('group', { name: 'Visões' })
    await waitFor(() =>
      expect(
        within(views).getByRole('button', { name: 'Todos os leads, 11 leads' }),
      ).toBeVisible(),
    )
    await userEvent.click(
      within(
        screen.getByRole('group', { name: 'Minhas visualizações' }),
      ).getByRole('button', { name: 'Meus leads quentes' }),
    )
    await expect(args.onSavedViewSelect).toHaveBeenCalledWith('sv-quentes')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Meus leads quentes',
      }),
    ).toBeVisible()
  },
}

export const WithoutSavedViewsTheHeadingNamesTheBlock: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(toolbarOf(canvasElement)).getByRole('heading', { name: 'Leads' }),
    ).toBeVisible()
  },
}

export const SavePreferenceCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
    await closeMenus()
  },
}

export const CreateCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Novo lead',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const AnEmptyBoardKeepsItsColumns: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      columnOf(canvasElement, /^Proposta enviada/).getByText(
        'Nenhum lead nesta etapa.',
      ),
    ).toBeVisible()
  },
}

export const AnEmptyTableNamesTheFilters: Story = {
  render: () => (
    <Crm2
      filtered
      leads={[]}
      mode="table"
      owners={owners}
      stages={stages}
      tags={tags}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum lead com esses filtros.'),
    ).toBeVisible()
  },
}

export const AnEmptyTableWithoutFilters: Story = {
  render: () => <Crm2 leads={[]} mode="table" stages={stages} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum lead ainda.'),
    ).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Crm2 leads={leads} pending stages={stages} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando leads')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('heading', { name: 'Leads' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Crm2 error leads={[]} onRetry={args.onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível listar os leads'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
