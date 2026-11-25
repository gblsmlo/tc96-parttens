import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal5 } from '@tc96/ui/blocks/data/legal/legal-5'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { owners, phases, records, tags } from '../fixtures/legal-5.ts'
import { type Legal5Controls, legal5ControlArgs } from './legal-5-controls.ts'
import { ComposedLegal5 } from './legal-5-layouts.tsx'

const callbacks = {
  onArchivedFilterChange: fn(),
  onBulkArchive: fn(),
  onBulkOwnerChange: fn(),
  onBulkPhaseChange: fn(),
  onBulkTagAdd: fn(),
  onClientFilterChange: fn(),
  onCollapsedGroupIdsChange: fn(),
  onCreate: fn(),
  onGroupByChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onOwnerChange: fn(),
  onOwnerFilterChange: fn(),
  onPageChange: fn(),
  onPhaseChange: fn(),
  onPhaseFilterChange: fn(),
  onPoleFilterChange: fn(),
  onRetry: fn(),
  onSavedViewCreate: fn(),
  onSavedViewDelete: fn(),
  onSavedViewDuplicate: fn(),
  onSavedViewRename: fn(),
  onSavedViewSelect: fn(),
  onSavedViewUpdate: fn(),
  onSavePreference: fn(),
  onSearchChange: fn(),
  onSelectedIdsChange: fn(),
  onSituationFilterChange: fn(),
  onSortChange: fn(),
  onTagFilterChange: fn(),
  onTagsChange: fn(),
  onUnarchive: fn(),
  onViewChange: fn(),
}

const meta = {
  args: { ...legal5ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal5/Behavior',
} satisfies Meta<Legal5Controls & Record<keyof typeof callbacks, () => void>>

export default meta

type Story = StoryObj<typeof meta>

const lawsuitTitle = 'Ação de cobrança contra fornecedor de farinha'
const secondLawsuitTitle = 'Reclamação trabalhista de ex-motorista'
const matterTitle = 'Revisão de contrato de locação comercial'
const archivedTitle = 'Inventário de Lúcia Meireles'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles de processos',
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

const chooseView = async (
  canvasElement: HTMLElement,
  current: string,
  next: string,
) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: current }),
  )
  await userEvent.click(await screen.findByRole('button', { name: next }))
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

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Processos' }),
    ).toBeVisible()
  },
}

export const ViewsShowTheirCountsAndReportTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Todos' }),
    )
    const lawsuits = await screen.findByRole('button', {
      name: 'Processos, 8 itens',
    })
    await waitFor(() => expect(lawsuits).toBeVisible())
    await expect(
      lawsuits.querySelector('[data-slot="view-switcher-item-count"]'),
    ).toHaveTextContent('8')
    await userEvent.click(
      screen.getByRole('button', { name: 'Casos, 4 itens' }),
    )
    await expect(args.onViewChange).toHaveBeenCalledWith('matter')
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Casos' }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(4)
  },
}

export const ViewsHaveNoCountWithoutCounts: Story = {
  args: { viewCounts: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Todos' }),
    )
    const matters = await screen.findByRole('button', { name: 'Casos' })
    await waitFor(() => expect(matters).toBeVisible())
    await expect(
      matters.querySelector('[data-slot="view-switcher-item-count"]'),
    ).toBeNull()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Casos' })).toBeNull(),
    )
  },
}

export const TheMatterViewHidesTheLawsuitFilters: Story = {
  play: async ({ canvasElement }) => {
    await chooseView(canvasElement, 'Todos', 'Casos, 4 itens')
    const menu = within(await openDisplayMenu(canvasElement))
    await expect(menu.getByRole('menuitem', { name: 'Cliente' })).toBeVisible()
    await expect(menu.queryByRole('menuitem', { name: 'Polo' })).toBeNull()
    await expect(menu.queryByRole('menuitem', { name: 'Situação' })).toBeNull()
    await expect(
      menu.queryByRole('menuitem', { name: 'Arquivados' }),
    ).toBeNull()
  },
}

export const ModeTabsSwitchToTheList: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Lista' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('list')
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-row"]'),
    ).toHaveLength(5)
  },
}

export const SearchReportsTheTextOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar processos',
    })
    await userEvent.type(field, 'despejo')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('despejo')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const SearchSitsBeforeTheDisplayMenu: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = within(toolbarOf(canvasElement))
    const field = toolbar.getByRole('searchbox', { name: 'Buscar processos' })
    const display = toolbar.getByRole('button', { name: /^Exibição/ })
    await expect(
      field.compareDocumentPosition(display) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const SortReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Ordenar por',
      'menuitemradio',
      'Título',
    )
    await expect(args.onSortChange).toHaveBeenCalledWith('title')
  },
}

export const PhaseFilterReportsTheCheckedPhases: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Fase',
      'menuitemcheckbox',
      'Instrução',
    )
    await expect(args.onPhaseFilterChange).toHaveBeenLastCalledWith([
      'instrucao',
    ])
    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Recurso' }),
    )
    await expect(args.onPhaseFilterChange).toHaveBeenLastCalledWith([
      'instrucao',
      'recurso',
    ])
  },
}

export const PhaseFilterGroupsThePhases: Story = {
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Fase' }))
    const lawsuitPhases = await screen.findByRole('group', {
      name: 'Processos',
    })
    await expect(
      within(lawsuitPhases).getByRole('menuitemcheckbox', {
        name: 'Instrução',
      }),
    ).toBeVisible()
    await expect(
      within(screen.getByRole('group', { name: 'Casos' })).getByRole(
        'menuitemcheckbox',
        { name: 'Consulta' },
      ),
    ).toBeVisible()
  },
}

export const OwnerFilterReportsTheOwner: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Responsável',
      'menuitemradio',
      'Rafael Antunes',
    )
    await expect(args.onOwnerFilterChange).toHaveBeenCalledWith('rafael')
    await waitFor(() =>
      expect(
        within(toolbarOf(canvasElement)).getByRole('button', {
          name: 'Exibição (1)',
        }),
      ).toBeVisible(),
    )
  },
}

export const ClientFilterReportsTheClient: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Cliente',
      'menuitemradio',
      'Helena Prado',
    )
    await expect(args.onClientFilterChange).toHaveBeenCalledWith('person:11')
  },
}

export const PoleFilterReportsThePole: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Polo',
      'menuitemradio',
      'Polo passivo',
    )
    await expect(args.onPoleFilterChange).toHaveBeenCalledWith('defendant')
  },
}

export const SituationFilterReportsTheSituation: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Situação',
      'menuitemradio',
      'Encerrados',
    )
    await expect(args.onSituationFilterChange).toHaveBeenCalledWith('closed')
  },
}

export const ArchivedFilterReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Arquivados',
      'menuitemradio',
      'Somente arquivados',
    )
    await expect(args.onArchivedFilterChange).toHaveBeenCalledWith('only')
  },
}

export const TagFilterReportsTheCheckedTags: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tags', 'menuitemcheckbox', 'Urgente')
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith(['urgente'])
  },
}

export const ClearFiltersResetsEveryFilter: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Responsável',
      'menuitemradio',
      'Rafael Antunes',
    )
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onOwnerFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onPhaseFilterChange).toHaveBeenLastCalledWith([])
  },
}

export const TheTitleCellMarksMattersAndArchivedLawsuits: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(rowOf(canvasElement, matterTitle)).getByText('Caso'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, archivedTitle)).getByText('Arquivado'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, lawsuitTitle)).queryByText('Caso'),
    ).toBeNull()
  },
}

export const TheListRowMarksTheTitleAndUnarchivesAtTheEnd: Story = {
  args: { mode: 'list' },
  play: async ({ args, canvasElement }) => {
    const archived = within(canvasElement)
      .getByRole('button', { name: archivedTitle })
      .closest('[data-slot="list-row"]') as HTMLElement
    const header = archived.querySelector(
      '[data-slot="list-row-header"]',
    ) as HTMLElement
    await expect(within(header).getByText('Arquivado')).toBeVisible()
    const action = archived.querySelector(
      '[data-slot="list-row-action"]',
    ) as HTMLElement
    await userEvent.click(
      within(action).getByRole('button', {
        name: `Desarquivar ${archivedTitle}`,
      }),
    )
    await expect(args.onUnarchive).toHaveBeenCalledWith('proc-505')
    await expect(args.onOpen).not.toHaveBeenCalled()
    const matter = within(canvasElement)
      .getByRole('button', { name: matterTitle })
      .closest('[data-slot="list-row"]') as HTMLElement
    await expect(
      within(
        matter.querySelector('[data-slot="list-row-header"]') as HTMLElement,
      ).getByText('Caso'),
    ).toBeVisible()
  },
}

export const TheNumberIsCopyable: Story = {
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, lawsuitTitle))
    await expect(row.getByText('5001234-18.2026.8.26.9001')).toBeVisible()
    await expect(
      row.getByRole('button', { name: 'Copiar número do processo' }),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, matterTitle)).queryByRole('button', {
        name: 'Copiar número do processo',
      }),
    ).toBeNull()
  },
}

export const TheNextDeadlineKeepsItsTone: Story = {
  play: async ({ canvasElement }) => {
    const deadline = within(rowOf(canvasElement, lawsuitTitle)).getByText(
      'Faltam 2 dias úteis',
    )
    await expect(deadline).toHaveAttribute('data-tone', 'danger')
    await expect(deadline).toHaveClass('text-destructive-foreground')
    await expect(
      within(rowOf(canvasElement, secondLawsuitTitle)).getByText(
        'Faltam 5 dias úteis',
      ),
    ).toHaveClass('text-warning-foreground')
    await expect(
      rowOf(canvasElement, matterTitle).querySelector(
        '[data-slot="legal-5-deadline"]',
      ),
    ).toBeNull()
  },
}

export const PhaseSelectOffersThePhasesOfTheKind: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, lawsuitTitle))
    await userEvent.click(
      row.getByRole('combobox', { name: 'Fase: Instrução' }),
    )
    await expect(
      await screen.findByRole('option', { name: 'Recurso' }),
    ).toBeVisible()
    await expect(screen.queryByRole('option', { name: 'Consulta' })).toBeNull()
    await userEvent.click(screen.getByRole('option', { name: 'Sentença' }))
    await expect(args.onPhaseChange).toHaveBeenCalledWith(
      'proc-501',
      'sentenca',
    )
  },
}

export const OwnerSelectReportsTheNewOwner: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, lawsuitTitle))
    await pick(
      row.getByRole('combobox', { name: 'Responsável: Beatriz Nogueira' }),
      'Thiago Freitas',
    )
    await expect(args.onOwnerChange).toHaveBeenCalledWith('proc-501', 'thiago')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const UnarchiveReportsTheRecordWithoutOpeningIt: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Desarquivar ${archivedTitle}`,
      }),
    )
    await expect(args.onUnarchive).toHaveBeenCalledWith('proc-505')
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const ReadOnlyHasNoUnarchiveButton: Story = {
  args: { editable: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', {
        name: `Desarquivar ${archivedTitle}`,
      }),
    ).toBeNull()
    await expect(
      within(rowOf(canvasElement, lawsuitTitle)).queryByRole('combobox'),
    ).toBeNull()
  },
}

export const ARowOpensTheRecord: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir ${lawsuitTitle}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('proc-501')
  },
}

export const SelectingRowsOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await selectRecord(canvasElement, lawsuitTitle)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'proc-501',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações dos processos selecionados',
    })
    await expect(bar).toHaveTextContent('1 selecionado')
  },
}

export const BulkPhaseReportsTheIdsAndClearsTheSelection: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, lawsuitTitle)
    await selectRecord(canvasElement, secondLawsuitTitle)
    await chooseInActionBar(canvasElement, 'Fase', 'Sentença')
    await expect(args.onBulkPhaseChange).toHaveBeenCalledWith(
      ['proc-501', 'proc-502'],
      'sentenca',
    )
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkPhaseNeedsRecordsOfOneKind: Story = {
  play: async ({ canvasElement }) => {
    await selectRecord(canvasElement, lawsuitTitle)
    await selectRecord(canvasElement, matterTitle)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await expect(bar.queryByRole('button', { name: 'Fase' })).toBeNull()
    await expect(bar.getByRole('button', { name: 'Responsável' })).toBeVisible()
  },
}

export const BulkOwnerReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, lawsuitTitle)
    await selectRecord(canvasElement, matterTitle)
    await chooseInActionBar(canvasElement, 'Responsável', 'Thiago Freitas')
    await expect(args.onBulkOwnerChange).toHaveBeenCalledWith(
      ['proc-501', 'caso-503'],
      'thiago',
    )
  },
}

export const BulkTagReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, matterTitle)
    await chooseInActionBar(canvasElement, 'Tags', 'Urgente')
    await expect(args.onBulkTagAdd).toHaveBeenCalledWith(
      ['caso-503'],
      'urgente',
    )
  },
}

export const BulkArchiveReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, lawsuitTitle)
    const bar = within(actionBarOf(canvasElement) as HTMLElement)
    await userEvent.click(bar.getByRole('button', { name: 'Arquivar' }))
    await expect(args.onBulkArchive).toHaveBeenCalledWith(['proc-501'])
  },
}

export const ClearSelectionClosesTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await selectRecord(canvasElement, lawsuitTitle)
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

export const PaginationReportsTheNextPage: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de processos' }),
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
        name: 'Paginação de processos',
      }),
    ).toBeNull()
    await expect(rowsOf(canvasElement)).toHaveLength(records.length)
  },
}

export const TheEmptyMessageFollowsTheView: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum processo ainda.')).toBeVisible()
    await chooseView(canvasElement, 'Todos', 'Casos, 4 itens')
    await expect(await canvas.findByText('Nenhum caso ainda.')).toBeVisible()
  },
}

export const TheEmptyMessageNamesTheFilters: Story = {
  render: () => (
    <Legal5 filtered owners={owners} phases={phases} records={[]} tags={tags} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum processo com esses filtros.'),
    ).toBeVisible()
  },
}

export const CreateCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Novo processo',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal5 pending records={records} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando processos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal5 error onRetry={args.onRetry} records={[]} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os processos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

const closeViewSwitcher = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const groupLabelsOf = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll('[data-slot="data-table-group-label"]'),
  ].map((label) => label.textContent)

export const SavedViewsFollowTheViewsAndApplyTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    )
    const mine = await screen.findByRole('group', { name: 'Minhas visões' })
    await waitFor(() => expect(mine).toBeVisible())
    await userEvent.click(
      within(mine).getByRole('button', { name: 'Processos da Beatriz' }),
    )
    await expect(args.onSavedViewSelect).toHaveBeenCalledWith('view-beatriz')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Processos da Beatriz',
      }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(3)
  },
}

export const AChangedSavedViewOffersTheUpdate: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseView(canvasElement, 'Todos', 'Processos da Beatriz')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await chooseInSubmenu(
      canvasElement,
      'Responsável',
      'menuitemradio',
      'Rafael Antunes',
    )
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    const trigger = within(toolbarOf(canvasElement)).getByRole('button', {
      name: 'Processos da Beatriz (alterada)',
    })
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Atualizar “Processos da Beatriz”',
      }),
    )
    await expect(args.onSavedViewUpdate).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const SavedViewOptionsReportTheView: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    )
    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Opções de Instrução e sentença',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Duplicar' }),
    )
    await expect(args.onSavedViewDuplicate).toHaveBeenCalledWith(
      'view-instrucao',
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await closeViewSwitcher()
  },
}

export const WithoutSavedViewsTheSwitcherListsOnlyTheViews: Story = {
  args: { savedViews: false },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    )
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Casos, 4 itens' }),
      ).toBeVisible(),
    )
    await expect(
      screen.queryByRole('group', { name: 'Minhas visões' }),
    ).toBeNull()
    await expect(
      screen.queryByRole('button', { name: 'Salvar visão atual…' }),
    ).toBeNull()
    await closeViewSwitcher()
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

export const CatalogsLoadingShowTheSkeletonInTheFilter: Story = {
  args: { catalogsLoading: true },
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Responsável' }),
    )
    const clear = await screen.findByRole('menuitemradio', {
      name: 'Todos os responsáveis',
    })
    await expect(clear.closest('[aria-busy="true"]')).not.toBeNull()
    await expect(
      screen.queryByRole('menuitemradio', { name: 'Rafael Antunes' }),
    ).toBeNull()
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const GroupingOrdersTheTableRowsByGroup: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Agrupar por', 'menuitemradio', 'Fase')
    await expect(args.onGroupByChange).toHaveBeenCalledWith('phase')
    await waitFor(() =>
      expect(groupLabelsOf(canvasElement)).toEqual([
        'Consulta',
        'Petição inicial',
        'Instrução',
        'Sentença',
        'Recurso',
      ]),
    )
    await userEvent.keyboard('{Escape}{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const ATableGroupCollapses: Story = {
  args: { groupBy: 'phase' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Recolher Instrução' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'phase:instrucao',
    ])
    await waitFor(() =>
      expect(within(canvasElement).queryByText(lawsuitTitle)).toBeNull(),
    )
    await expect(
      within(canvasElement).getByRole('button', { name: 'Expandir Instrução' }),
    ).toHaveAttribute('aria-expanded', 'false')
  },
}

export const AListGroupCollapses: Story = {
  args: { groupBy: 'owner', mode: 'list' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: secondLawsuitTitle }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher Rafael Antunes' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'owner:rafael',
    ])
    await waitFor(() =>
      expect(
        canvas.queryByRole('button', { name: secondLawsuitTitle }),
      ).toBeNull(),
    )
  },
}

export const TagsAreEditableInTheRow: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, secondLawsuitTitle))
    await userEvent.click(row.getByRole('button', { name: 'Adicionar tag' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Urgente' }),
    )
    await expect(args.onTagsChange).toHaveBeenCalledWith('proc-502', [
      'trabalhista',
      'urgente',
    ])
    await expect(args.onOpen).not.toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const WithoutOnTagsChangeTheTagsAreReadOnly: Story = {
  args: { editable: false },
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, secondLawsuitTitle))
    await expect(row.getByText('Trabalhista')).toBeVisible()
    await expect(
      row.queryByRole('button', { name: 'Adicionar tag' }),
    ).toBeNull()
  },
}

export const TheSearchCountsAsAFilter: Story = {
  play: async ({ args, canvasElement }) => {
    const toolbar = within(toolbarOf(canvasElement))
    const field = toolbar.getByRole('searchbox', { name: 'Buscar processos' })
    await userEvent.type(field, 'despejo{Enter}')
    await waitFor(() =>
      expect(
        toolbar.getByRole('button', { name: 'Exibição (1)' }),
      ).toBeVisible(),
    )
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('')
    await waitFor(() => expect(field).toHaveValue(''))
    await expect(screen.getByRole('menu')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}
