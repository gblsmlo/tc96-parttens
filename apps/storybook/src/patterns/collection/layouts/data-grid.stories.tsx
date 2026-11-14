import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ActionBar,
  DataGrid,
  type DataGridColumnDef,
  type DataGridDensity,
  useDataGrid,
} from '@tc96/parttens'
import { ArchiveIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../test-utils/sleep'
import { createDataGridColumns } from '../fixtures/task-fields'
import { useTasks } from '../fixtures/task-renderers'
import { initialTasks, people, type Task } from '../fixtures/tasks'

const assigneeOrder = people.map((person) => person.id)
const sortByAssignee = (tasks: readonly Task[]) =>
  [...tasks].sort(
    (a, b) =>
      assigneeOrder.indexOf(a.assigneeId) - assigneeOrder.indexOf(b.assigneeId),
  )
const assigneeName = (task: Task) =>
  people.find((person) => person.id === task.assigneeId)?.name ?? null

interface DataGridExampleProps {
  /** Vertical density of the rows. */
  density?: DataGridDensity
  /** Replaces the rows with loading skeletons. */
  isLoading?: boolean
  /** Groups consecutive rows that share the assignee. */
  grouped?: boolean
  /** Collapsed groups, when the grid's composer owns that state. */
  collapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  /** Turns on the selection column and the per-row checkbox. */
  selectable?: boolean
  /** Paginates on the client. The pagination footer comes with it, no extra wiring. */
  paginated?: boolean
  /** Displayed collection. Pass an empty list to see the empty message. */
  data?: Task[]
  /** Height cap. Without it the grid is as tall as its content; with it, it scrolls inside. */
  maxHeight?: number
  /** Expands the composition to the available height to validate actions anchored to the footer. */
  fullHeight?: boolean
}

function DataGridExample({
  collapsedGroupIds,
  data = initialTasks,
  density,
  grouped = false,
  onCollapsedGroupIdsChange,
  isLoading = false,
  maxHeight,
  paginated = false,
  selectable = false,
  fullHeight = false,
}: Readonly<DataGridExampleProps>): ReactElement {
  const { tasks, updateTask } = useTasks(data)
  const columns = useMemo(() => {
    const all = createDataGridColumns(updateTask)
    return selectable ? all : all.filter((column) => column.id !== 'select')
  }, [selectable, updateTask])
  const rows = useMemo(
    () => (grouped ? sortByAssignee(tasks) : tasks),
    [grouped, tasks],
  )
  const { table } = useDataGrid<Task>({
    columns,
    data: rows,
    enablePagination: paginated,
    enableRowSelection: selectable,
    getRowId: (task) => task.id,
    pageSize: 5,
  })

  return (
    <div
      className={`flex min-w-0 flex-col gap-2 p-4${fullHeight ? ' min-h-screen' : ''}`}
    >
      <DataGrid
        aria-label="Tarefas do lançamento"
        density={density}
        emptyMessage="Nenhuma tarefa para exibir."
        getRowGroup={grouped ? assigneeName : undefined}
        {...(collapsedGroupIds ? { collapsedGroupIds } : {})}
        {...(onCollapsedGroupIdsChange ? { onCollapsedGroupIdsChange } : {})}
        isLoading={isLoading}
        loadingRowAnatomy={{ cell: 'control' }}
        loadingRowCount={paginated ? 5 : rows.length}
        maxHeight={maxHeight}
        selectionActions={
          selectable
            ? ({ clearSelection, selectedCount, selectedRows }) => (
                <ActionBar
                  actions={[
                    {
                      items: [
                        {
                          icon: <SendIcon />,
                          label: 'Enviar',
                          onSelect: () => undefined,
                          variant: 'primary',
                        },
                        {
                          icon: <ArchiveIcon />,
                          label: 'Arquivar',
                          onSelect: () => undefined,
                        },
                      ],
                    },
                    {
                      items: [
                        {
                          label: 'Mais opções',
                          submenu: [
                            {
                              label: 'Organizar',
                              items: [
                                {
                                  label: 'Duplicar',
                                  onSelect: () => undefined,
                                },
                                {
                                  label: 'Mover para…',
                                  onSelect: () => undefined,
                                },
                              ],
                            },
                            {
                              items: [
                                {
                                  icon: <Trash2Icon />,
                                  label: 'Excluir',
                                  onSelect: () => undefined,
                                  variant: 'destructive',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ]}
                  onClearSelection={clearSelection}
                  selectedCount={selectedCount}
                  selectedRows={selectedRows}
                />
              )
            : undefined
        }
        table={table}
      />
    </div>
  )
}

interface GridArgs {
  density: DataGridDensity
  empty: boolean
  grouped: boolean
  isLoading: boolean
  paginated: boolean
  selectable: boolean
}

const GridDoc = DataGrid as unknown as (props: GridArgs) => ReactElement

const hidden = { table: { disable: true } } as const
const LOAD_DELAY = 2000
const PAGE_SIZE = 5

const usage = `
import { DataGrid, useDataGrid } from '@acme/patterns'

const { table } = useDataGrid({
  columns,
  data,
  enablePagination: true,
  enableRowSelection: true,
  getRowId: (task) => task.id,
  pageSize: 5,
})

<DataGrid
  aria-label="Tarefas"
  density="medium"
  getRowGroup={(task) => task.assigneeName}
  isLoading={isLoading}
  loadingRowAnatomy={{ cell: 'control' }}
  loadingRowCount={5}
  selectionActions={({ selectedCount, clearSelection }) => <ActionBar … />}
  table={table}
/>
`

const docs = {
  api: [
    {
      description:
        'Spreadsheet over the WAI-ARIA grid pattern and a TanStack table from `useDataGrid`. Cells are focusable with the arrow keys, Home and End; Shift extends the cell selection. `getRowGroup` opens a collapsible group row per run of equal values; `selectionActions` renders over the footer while rows are selected; the pagination footer comes with a paginated table. Rows are virtualized without groups. `density` sets the row height, and loading rows keep it.',
      name: 'DataGrid',
    },
    {
      description:
        'Builds the table: `enablePagination` with `pageSize`, `enableRowSelection`, `getRowId` and `onCellValueChange` for editable cells.',
      name: 'useDataGrid',
    },
  ],
  description: {
    component:
      '`DataGrid` renders a collection as an editable spreadsheet. `Anatomy` shows the header, the rows and the footer, driven by the controls. `Usage` is the Tasks grid with selection, groups and pagination. `Behavior` is the usage under test: it loads after a simulated delay keeping the row height, moves the cell focus with the keyboard, selects rows with their action bar and pages forward and back.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-16 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

interface AnatomyRecord {
  group: string
  id: string
}

const anatomyRecords: AnatomyRecord[] = [
  { group: 'Group', id: 'a' },
  { group: 'Group', id: 'b' },
  { group: 'Another group', id: 'c' },
]

const anatomyColumns: DataGridColumnDef<AnatomyRecord>[] = [
  {
    accessorKey: 'id',
    cell: () => <span className={slotClassName}>cell</span>,
    header: () => <span className={slotClassName}>header</span>,
  },
  {
    accessorKey: 'group',
    cell: () => <span className={slotClassName}>cell</span>,
    header: () => <span className={slotClassName}>header</span>,
  },
]

function AnatomyGrid({
  density,
  empty,
  grouped,
  isLoading,
  paginated,
}: Readonly<GridArgs>): ReactElement {
  const { table } = useDataGrid<AnatomyRecord>({
    columns: anatomyColumns,
    data: empty ? [] : anatomyRecords,
    enablePagination: paginated,
    getRowId: (record) => record.id,
    pageSize: 2,
  })

  return (
    <DataGrid
      aria-label="Anatomy"
      density={density}
      emptyMessage="emptyMessage"
      getRowGroup={grouped ? (record) => record.group : undefined}
      isLoading={isLoading}
      table={table}
    />
  )
}

function LoadingTasksGrid() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <DataGridExample isLoading={isLoading} paginated selectable />
}

const meta = {
  args: {
    density: 'medium',
    empty: false,
    grouped: false,
    isLoading: false,
    paginated: true,
    selectable: true,
  },
  argTypes: {
    density: {
      control: 'inline-radio',
      options: ['short', 'medium', 'tall', 'extra-tall'],
    },
    empty: { control: 'boolean' },
    grouped: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    paginated: { control: 'boolean' },
    selectable: { control: 'boolean' },
  },
  component: GridDoc,
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-2rem)] max-w-[1280px]">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Collection/Layouts/Data Grid',
} satisfies Meta<GridArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  argTypes: { selectable: hidden },
  play: async ({ args, canvasElement }) => {
    if (args.isLoading || args.empty) return
    await expect(
      within(canvasElement).getAllByRole('columnheader').length,
    ).toBeGreaterThan(0)
  },
  render: (args) => (
    <div className="p-4">
      <AnatomyGrid {...args} />
    </div>
  ),
}

export const Usage: Story = {
  render: ({ empty, ...args }) => (
    <DataGridExample {...args} {...(empty ? { data: [] } : {})} />
  ),
}

export const Behavior: Story = {
  argTypes: {
    density: hidden,
    empty: hidden,
    grouped: hidden,
    isLoading: hidden,
    paginated: hidden,
    selectable: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Tarefas do lançamento' })
    const bodyRows = () =>
      [...grid.querySelectorAll<HTMLElement>('[role="row"]')].filter((row) =>
        row.querySelector('[role="gridcell"]'),
      )

    await expect(grid).toHaveAttribute('aria-busy', 'true')
    const skeletonRowHeight = bodyRows()[0]?.getBoundingClientRect().height

    const [first] = initialTasks
    if (!first) throw new Error('The fixture has no task.')
    await canvas.findByText(first.title, undefined, {
      timeout: LOAD_DELAY * 2,
    })
    await expect(grid).not.toHaveAttribute('aria-busy')
    await expect(bodyRows()[0]?.getBoundingClientRect().height).toBe(
      skeletonRowHeight,
    )
    const gridHeight = grid.getBoundingClientRect().height

    const titleCell = canvas
      .getByText(first.title)
      .closest<HTMLElement>('[role="gridcell"]')
    if (!titleCell) throw new Error('The title is not inside a grid cell.')
    await userEvent.click(titleCell)
    await waitFor(() =>
      expect(titleCell.contains(document.activeElement)).toBe(true),
    )
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() =>
      expect(titleCell.contains(document.activeElement)).toBe(false),
    )
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() =>
      expect(titleCell.contains(document.activeElement)).toBe(true),
    )

    const [checkbox] = canvas.getAllByRole('checkbox', {
      name: 'Selecionar registro',
    })
    if (!checkbox) throw new Error('The grid has no row checkbox.')
    await userEvent.click(checkbox)
    await expect(
      await canvas.findByRole('button', { name: 'Enviar' }),
    ).toBeVisible()
    await userEvent.click(checkbox)
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Enviar' })).toBeNull(),
    )

    const pageOf = (page: number) =>
      initialTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const goTo = async (name: string, page: number) => {
      await sleep(LOAD_DELAY)
      await userEvent.click(canvas.getByRole('button', { name }))
      await canvas.findByText(pageOf(page)[0]?.title ?? '')
      await expect(grid.getBoundingClientRect().height).toBe(gridHeight)
    }
    await goTo('Próxima página', 2)
    await goTo('Página anterior', 1)
  },
  render: () => <LoadingTasksGrid />,
}
