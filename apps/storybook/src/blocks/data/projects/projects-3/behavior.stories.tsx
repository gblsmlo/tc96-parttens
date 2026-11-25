import type { Meta, StoryObj } from '@storybook/react-vite'
import { Projects3 } from '@tc96/ui/blocks/data/projects/projects-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { assignees, tags, tasks, types } from '../fixtures/projects-3.ts'
import {
  type Projects3Controls,
  projects3ControlArgs,
} from './projects-3-controls.ts'
import { ComposedProjects3 } from './projects-3-layouts.tsx'

const callbacks = {
  onArchivedFilterChange: fn(),
  onAssigneeChange: fn(),
  onAssigneeFilterChange: fn(),
  onBulkArchive: fn(),
  onBulkAssigneeChange: fn(),
  onBulkPriorityChange: fn(),
  onBulkStatusChange: fn(),
  onBulkTypeChange: fn(),
  onCollapsedGroupIdsChange: fn(),
  onCreate: fn(),
  onDueChange: fn(),
  onExpandedChange: fn(),
  onGroupByChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onPageChange: fn(),
  onPriorityChange: fn(),
  onRetry: fn(),
  onSavedViewChange: fn(),
  onSavedViewCreate: fn(),
  onSavePreference: fn(),
  onSearchChange: fn(),
  onSelectedIdsChange: fn(),
  onSortChange: fn(),
  onStartChange: fn(),
  onStatusChange: fn(),
  onStatusFilterChange: fn(),
  onTagFilterChange: fn(),
  onTagsChange: fn(),
  onTypeChange: fn(),
}

const meta = {
  args: { ...projects3ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedProjects3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects3/Behavior',
} satisfies Meta<Projects3Controls & Record<keyof typeof callbacks, () => void>>

export default meta

type Story = StoryObj<typeof meta>

const meetingTitle = 'Organizar a reunião trimestral'
const meetingSubtask = 'Reservar a sala de reuniões'
const reportTitle = 'Revisar o relatório financeiro de novembro'
const callTitle = 'Retornar a ligação do cliente sobre a fatura'
const pendingKanbanTitle = reportTitle

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles das tarefas' })

const actionBarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="action-bar"]')

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll(
    '[data-slot="data-table"] tbody tr:not([data-slot="data-table-group-row"])',
  )

const rowOf = (canvasElement: HTMLElement, title: string) =>
  within(canvasElement).getByText(title).closest('tr') as HTMLElement

const groupRowOf = (canvasElement: HTMLElement, toggle: string) =>
  within(canvasElement)
    .getByRole('button', { name: toggle })
    .closest('tr') as HTMLElement

const groupCountOf = (canvasElement: HTMLElement, toggle: string) =>
  groupRowOf(canvasElement, toggle).querySelector(
    '[data-slot="data-table-group-count"]',
  )

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', {
      name: /^Exibição/,
    }),
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

const dayButton = (grid: HTMLElement, day: string) => {
  const button = within(grid)
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === day)
    ?.querySelector('button')
  if (!button) throw new Error(`The calendar did not render day ${day}.`)
  return button
}

const selectTask = (canvasElement: HTMLElement, title: string) =>
  userEvent.click(
    within(canvasElement).getByRole('checkbox', {
      name: `Selecionar ${title}`,
    }),
  )

const expandTask = (canvasElement: HTMLElement, title: string) =>
  userEvent.click(
    within(canvasElement).getByRole('button', {
      name: `Expandir subtarefas de ${title}`,
    }),
  )

const chooseInMoreOptions = async (
  canvasElement: HTMLElement,
  group: string,
  option: string,
) => {
  const bar = within(actionBarOf(canvasElement) as HTMLElement)
  await userEvent.click(bar.getByRole('button', { name: 'Mais opções' }))
  await userEvent.click(
    within(await screen.findByRole('group', { name: group })).getByRole(
      'menuitem',
      { name: option },
    ),
  )
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const TheHeadingNamesTheSection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Tarefas' })).toBeVisible()
    await expect(canvas.getByRole('region', { name: 'Tarefas' })).toBeVisible()
    await expect(canvas.getByRole('table', { name: 'Tarefas' })).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Projects3 pending tasks={tasks} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando tarefas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('heading', { name: 'Tarefas' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: /^Exibição/ })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Projects3 error onRetry={args.onRetry} tasks={[]} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as tarefas'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const EmptyShowsTheEmptyMessage: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma tarefa ainda.'),
    ).toBeVisible()
  },
}

export const TheEmptyMessageNamesTheFilters: Story = {
  render: () => <Projects3 filtered tasks={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma tarefa com esses filtros.'),
    ).toBeVisible()
  },
}

export const TheTitleCellShowsTheDescription: Story = {
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, meetingTitle))
    await expect(
      row.getByText('Pauta, convidados e sala para a revisão do trimestre.'),
    ).toHaveClass('text-muted-foreground')
  },
}

export const ArchivedTasksShowTheMark: Story = {
  render: () => (
    <Projects3 assignees={assignees} tags={tags} tasks={tasks} types={types} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(
        rowOf(canvasElement, 'Fechar o inventário de equipamentos'),
      ).getByText('Arquivada'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, meetingTitle)).queryByText('Arquivada'),
    ).toBeNull()
  },
}

export const TypeSelectReportsTheType: Story = {
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, meetingTitle)).getByRole('combobox', {
        name: 'Tipo: Reunião',
      }),
      'Pesquisa',
    )
    await expect(args.onTypeChange).toHaveBeenCalledWith('task-301', 'research')
  },
}

export const PrioritySelectReportsThePriority: Story = {
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, reportTitle)).getByRole('combobox', {
        name: 'Prioridade: Alta',
      }),
      'Baixa',
    )
    await expect(args.onPriorityChange).toHaveBeenLastCalledWith(
      'task-302',
      'low',
    )
    await pick(
      within(rowOf(canvasElement, reportTitle)).getByRole('combobox', {
        name: 'Prioridade: Baixa',
      }),
      'Sem prioridade',
    )
    await expect(args.onPriorityChange).toHaveBeenLastCalledWith(
      'task-302',
      null,
    )
  },
}

export const StatusSelectReportsTheStatus: Story = {
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, reportTitle)).getByRole('combobox', {
        name: 'Status: Pendente',
      }),
      'Em andamento',
    )
    await expect(args.onStatusChange).toHaveBeenCalledWith(
      'task-302',
      'in-progress',
    )
  },
}

export const AssigneeSelectReportsTheAssignee: Story = {
  play: async ({ args, canvasElement }) => {
    await pick(
      within(rowOf(canvasElement, reportTitle)).getByRole('combobox', {
        name: 'Responsável: Bruno Lacerda',
      }),
      'Carla Mendes',
    )
    await expect(args.onAssigneeChange).toHaveBeenCalledWith(
      'task-302',
      'carla',
    )
  },
}

export const StartDateReportsTheDay: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(rowOf(canvasElement, reportTitle)).getByRole('button', {
        name: /^Início:/,
      }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '25'))
    await expect(args.onStartChange).toHaveBeenCalledWith(
      'task-302',
      '2026-11-25',
    )
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const DayOnlyDatesShowTheirDay: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, reportTitle))
    await expect(
      row.getByRole('button', { name: 'Vencimento: 28 de nov.' }),
    ).toBeVisible()
    await userEvent.click(
      row.getByRole('button', { name: 'Início: 24 de nov.' }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '26'))
    await expect(args.onStartChange).toHaveBeenCalledWith(
      'task-302',
      '2026-11-26',
    )
    await expect(
      await row.findByRole('button', { name: 'Início: 26 de nov.' }),
    ).toBeVisible()
  },
}

export const DueDateReportsTheDay: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(rowOf(canvasElement, reportTitle)).getByRole('button', {
        name: /^Vencimento:/,
      }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '30'))
    await expect(args.onDueChange).toHaveBeenCalledWith(
      'task-302',
      '2026-11-30',
    )
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const DueDateMarksOverdueAndClears: Story = {
  play: async ({ args, canvasElement }) => {
    const due = within(rowOf(canvasElement, meetingTitle)).getByRole('button', {
      name: /^Vencimento:/,
    })
    await expect(due).toHaveAttribute('data-overdue', 'true')
    await expect(
      within(rowOf(canvasElement, reportTitle)).getByRole('button', {
        name: /^Vencimento:/,
      }),
    ).not.toHaveAttribute('data-overdue')
    await userEvent.click(due)
    await userEvent.click(
      await screen.findByRole('button', { name: 'Limpar data' }),
    )
    await expect(args.onDueChange).toHaveBeenCalledWith('task-301', null)
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const TagsReportTheNewList: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(rowOf(canvasElement, reportTitle)).getByRole('button', {
        name: 'Adicionar tag',
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Cliente' }),
    )
    await expect(args.onTagsChange).toHaveBeenCalledWith('task-302', [
      'financeiro',
      'cliente',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const ReadOnlyWithoutCellCallbacks: Story = {
  args: { editable: false },
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, reportTitle))
    await expect(row.queryByRole('combobox')).toBeNull()
    await expect(row.queryByRole('button', { name: /^Início:/ })).toBeNull()
    await expect(
      row.queryByRole('button', { name: 'Adicionar tag' }),
    ).toBeNull()
    await expect(row.getByText('Financeiro')).toBeVisible()
  },
}

export const ARowOpensTheTask: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir detalhes da tarefa: ${meetingTitle}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('task-301')
  },
}

export const SubtasksExpandAndCollapse: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText(meetingSubtask)).toBeNull()
    await expect(
      within(rowOf(canvasElement, reportTitle)).queryByRole('button', {
        name: /subtarefas/,
      }),
    ).toBeNull()
    await expandTask(canvasElement, meetingTitle)
    await expect(args.onExpandedChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ 'task-301': true }),
    )
    await expect(await canvas.findByText(meetingSubtask)).toBeVisible()
    await expect(
      canvas.getByText('Enviar a pauta aos participantes'),
    ).toBeVisible()
    await expect(
      rowOf(canvasElement, meetingSubtask).querySelector(
        '[data-slot="data-table-expand"]',
      ),
    ).toHaveAttribute('data-depth', '1')
    await userEvent.click(
      canvas.getByRole('button', {
        name: `Recolher subtarefas de ${meetingTitle}`,
      }),
    )
    await expect(args.onExpandedChange).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(canvas.queryByText(meetingSubtask)).toBeNull())
  },
}

export const ASubtaskOpensItself: Story = {
  play: async ({ args, canvasElement }) => {
    await expandTask(canvasElement, meetingTitle)
    await userEvent.click(
      await within(canvasElement).findByRole('button', {
        name: `Abrir detalhes da tarefa: ${meetingSubtask}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('task-301-1')
  },
}

export const GroupByReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Agrupar por',
      'menuitemradio',
      'Prioridade',
    )
    await expect(args.onGroupByChange).toHaveBeenCalledWith('priority')
    await closeMenus()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Recolher Urgente' }),
    ).toBeVisible()
    await expect(
      groupCountOf(canvasElement, 'Recolher Urgente'),
    ).toHaveTextContent('2')
  },
}

export const GroupsCollapseAndReport: Story = {
  args: { groupBy: 'status' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Recolher Em andamento' }),
    ).toBeVisible()
    await expect(canvas.getByText(reportTitle)).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher Pendente' }),
    )
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([
      'status:pending',
    ])
    await waitFor(() => expect(canvas.queryByText(reportTitle)).toBeNull())
    const toggle = canvas.getByRole('button', { name: 'Expandir Pendente' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    await expect(args.onCollapsedGroupIdsChange).toHaveBeenLastCalledWith([])
    await expect(await canvas.findByText(reportTitle)).toBeVisible()
  },
}

export const GroupsKeepSubtasksUnderTheirParent: Story = {
  args: { groupBy: 'status' },
  play: async ({ canvasElement }) => {
    await expandTask(canvasElement, meetingTitle)
    const subtask = await within(canvasElement).findByText(meetingSubtask)
    await expect(subtask.closest('tbody')).toBe(
      rowOf(canvasElement, meetingTitle).closest('tbody'),
    )
    await expect(
      groupCountOf(canvasElement, 'Recolher Em andamento'),
    ).toHaveTextContent('2')
    await expect(
      groupCountOf(canvasElement, 'Recolher Concluída'),
    ).toHaveTextContent('1')
  },
}

export const KanbanOffersOnlyStatusAndPriorityGroups: Story = {
  args: { mode: 'kanban' },
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Agrupar por' }),
    )
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Status' }),
    ).toBeVisible()
    await expect(
      screen.getByRole('menuitemradio', { name: 'Prioridade' }),
    ).toBeVisible()
    await expect(
      screen.queryByRole('menuitemradio', { name: 'Nenhum' }),
    ).toBeNull()
    await expect(
      screen.queryByRole('menuitemradio', { name: 'Responsável' }),
    ).toBeNull()
    await closeMenus()
  },
}

export const ModeTabsSwitchToTheKanban: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Kanban' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('kanban')
    await closeMenus()
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('table')).toBeNull()
    await expect(
      await canvas.findByRole('region', { name: 'Pendente' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Em andamento' }),
    ).toBeVisible()
  },
}

export const KanbanDropReportsTheStatus: Story = {
  args: { mode: 'kanban' },
  play: async ({ args, canvasElement }) => {
    const handle = within(
      within(canvasElement).getByRole('region', { name: 'Pendente' }),
    ).getByRole('button', { name: `Mover card ${pendingKanbanTitle}` })
    handle.focus()
    await expect(handle).toHaveFocus()
    await userEvent.keyboard('[Space]')
    await waitFor(() =>
      expect(
        document.querySelector('[data-dnd-overlay]'),
      ).not.toBeEmptyDOMElement(),
    )
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Space]')
    await waitFor(() =>
      expect(
        document.querySelector('[data-dnd-overlay]'),
      ).toBeEmptyDOMElement(),
    )
    await expect(args.onStatusChange).toHaveBeenCalledWith(
      'task-302',
      'in-progress',
    )
  },
}

export const KanbanByPriorityTakesNoDrop: Story = {
  args: { groupBy: 'priority', mode: 'kanban' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Urgente' })).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: /^Mover card/ }),
    ).toBeNull()
  },
}

export const KanbanCardShowsDuePriorityAndTags: Story = {
  args: { mode: 'kanban' },
  play: async ({ args, canvasElement }) => {
    const column = within(
      within(canvasElement).getByRole('region', { name: 'Pendente' }),
    )
    await expect(
      column.getByRole('combobox', { name: 'Prioridade: Urgente' }),
    ).toBeVisible()
    await expect(column.getAllByText('Cliente').length).toBeGreaterThan(0)
    await userEvent.click(
      column.getByRole('button', {
        name: `Abrir detalhes da tarefa: ${callTitle}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('task-304')
  },
}

export const SelectingTasksOpensTheActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    await expect(actionBarOf(canvasElement)).toBeNull()
    await selectTask(canvasElement, reportTitle)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'task-302',
    ])
    const bar = await within(canvasElement).findByRole('toolbar', {
      name: 'Ações das tarefas selecionadas',
    })
    await expect(bar).toHaveTextContent('1 selecionada')
  },
}

export const SelectingAParentLeavesItsSubtasks: Story = {
  play: async ({ args, canvasElement }) => {
    await expandTask(canvasElement, meetingTitle)
    const subtaskRow = (
      await within(canvasElement).findByText(meetingSubtask)
    ).closest('tr') as HTMLElement
    await expect(within(subtaskRow).queryByRole('checkbox')).toBeNull()
    await selectTask(canvasElement, meetingTitle)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([
      'task-301',
    ])
    await expect(actionBarOf(canvasElement)).toHaveTextContent('1 selecionada')
  },
}

export const SelectionSurvivesACollapsedGroup: Story = {
  args: { groupBy: 'status' },
  play: async ({ canvasElement }) => {
    await selectTask(canvasElement, reportTitle)
    await selectTask(canvasElement, meetingTitle)
    await expect(actionBarOf(canvasElement)).toHaveTextContent('2 selecionadas')
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Recolher Pendente' }),
    )
    await waitFor(() =>
      expect(within(canvasElement).queryByText(reportTitle)).toBeNull(),
    )
    await expect(actionBarOf(canvasElement)).toHaveTextContent('2 selecionadas')
  },
}

export const BulkCompleteReportsTheIdsAndClearsTheSelection: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTask(canvasElement, reportTitle)
    await selectTask(canvasElement, callTitle)
    await userEvent.click(
      within(actionBarOf(canvasElement) as HTMLElement).getByRole('button', {
        name: 'Concluídas',
      }),
    )
    await expect(args.onBulkStatusChange).toHaveBeenCalledWith(
      ['task-302', 'task-304'],
      'completed',
    )
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkPriorityReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTask(canvasElement, reportTitle)
    await chooseInMoreOptions(canvasElement, 'Prioridade', 'Sem prioridade')
    await expect(args.onBulkPriorityChange).toHaveBeenCalledWith(
      ['task-302'],
      null,
    )
    await waitFor(() => expect(actionBarOf(canvasElement)).toBeNull())
  },
}

export const BulkTypeReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTask(canvasElement, reportTitle)
    await chooseInMoreOptions(canvasElement, 'Tipo', 'Ligação')
    await expect(args.onBulkTypeChange).toHaveBeenCalledWith(
      ['task-302'],
      'call',
    )
  },
}

export const BulkAssigneeReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTask(canvasElement, reportTitle)
    await chooseInMoreOptions(canvasElement, 'Responsável', 'Sem responsável')
    await expect(args.onBulkAssigneeChange).toHaveBeenCalledWith(
      ['task-302'],
      null,
    )
  },
}

export const BulkArchiveReportsTheIds: Story = {
  play: async ({ args, canvasElement }) => {
    await selectTask(canvasElement, reportTitle)
    await userEvent.click(
      within(actionBarOf(canvasElement) as HTMLElement).getByRole('button', {
        name: 'Arquivar',
      }),
    )
    await expect(args.onBulkArchive).toHaveBeenCalledWith(['task-302'])
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
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar tarefas',
    })
    await userEvent.type(field, 'fatura')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('fatura')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const SortReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Ordenar por',
      'menuitemradio',
      'Vencimento',
    )
    await expect(args.onSortChange).toHaveBeenCalledWith('due')
    await closeMenus()
  },
}

export const StatusFilterReportsTheStatus: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Status', 'menuitemradio', 'Pendente')
    await expect(args.onStatusFilterChange).toHaveBeenCalledWith('pending')
    await closeMenus()
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Exibição (1)',
      }),
    ).toBeVisible()
  },
}

export const AssigneeFilterReportsTheAssignee: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Responsável',
      'menuitemradio',
      'Bruno Lacerda',
    )
    await expect(args.onAssigneeFilterChange).toHaveBeenCalledWith('bruno')
    await closeMenus()
  },
}

export const ArchivedFilterReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(
      canvasElement,
      'Arquivadas',
      'menuitemradio',
      'Somente arquivadas',
    )
    await expect(args.onArchivedFilterChange).toHaveBeenCalledWith('only')
    await closeMenus()
  },
}

export const TagFilterReportsTheCheckedTags: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tags', 'menuitemcheckbox', 'Cliente')
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith(['cliente'])
    await closeMenus()
  },
}

export const ClearFiltersResetsEveryFilter: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Status', 'menuitemradio', 'Pendente')
    await closeMenus()
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onStatusFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onAssigneeFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onArchivedFilterChange).toHaveBeenLastCalledWith(null)
    await expect(args.onTagFilterChange).toHaveBeenLastCalledWith([])
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const CatalogsLoadingShowTheSubmenuSkeleton: Story = {
  render: (args) => (
    <Projects3
      assigneesLoading
      onAssigneeFilterChange={args.onAssigneeFilterChange}
      tasks={tasks}
    />
  ),
  play: async ({ canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Responsável' }),
    )
    await waitFor(() =>
      expect(document.querySelector('[aria-busy="true"]')).not.toBeNull(),
    )
    await closeMenus()
  },
}

export const SavedViewsReplaceTheHeading: Story = {
  args: { savedViews: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('heading')).toBeNull()
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Todas as tarefas',
      }),
    )
    await userEvent.click(
      await screen.findByRole('button', { name: 'Minhas pendentes' }),
    )
    await expect(args.onSavedViewChange).toHaveBeenCalledWith('view-mine')
    await waitFor(() =>
      expect(
        within(toolbarOf(canvasElement)).getByRole('button', {
          name: 'Minhas pendentes',
        }),
      ).toBeVisible(),
    )
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Todas as tarefas' }),
      ).toBeNull(),
    )
  },
}

export const SavePreferenceCallsItsCallback: Story = {
  args: { savedViews: true },
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Salvar preferência' }),
    )
    await expect(args.onSavePreference).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const PaginationReportsTheNextPage: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de tarefas' }),
      ).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('6–10 de 12')).toBeVisible()
  },
}

export const CreateCallsItsCallback: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Nova tarefa',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
  },
}
