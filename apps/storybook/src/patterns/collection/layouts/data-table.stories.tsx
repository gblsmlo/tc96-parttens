import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionToolbar,
  DataGridPagination,
  DataTable,
  type DataTableColumnDef,
  DataTableColumnsSubmenu,
  type DataTableProps,
  type DataTableRowSkeletonAnatomy,
  useDataTable,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../test-utils/sleep'
import {
  createDataTableColumns,
  taskTableAggregations,
} from '../fixtures/task-fields'
import { useTasks } from '../fixtures/task-renderers'
import { initialTasks, type Task } from '../fixtures/tasks'

interface TableArgs {
  bordered: boolean
  empty: boolean
  isLoading: boolean
  paginated: boolean
  resizable: boolean
}

const TableDoc = DataTable as unknown as (props: TableArgs) => ReactElement

const hidden = { table: { disable: true } } as const
const openTask = fn()
const LOAD_DELAY = 2000
const PAGE_SIZE = 5

const taskRowAnatomy: DataTableRowSkeletonAnatomy = {
  cell: 'control',
  lines: 2,
}

const usage = `
import {
  DataGridPagination,
  DataTable,
  DataTableColumnsSubmenu,
  useDataTable,
} from '@acme/patterns'

const { table } = useDataTable({
  columns,
  data,
  enablePagination: true,
  enableRowSelection: true,
  getRowId: (task) => task.id,
  pageSize: 5,
})

<DataTable
  aria-label="Tarefas"
  defaultAggregations={{ estimate: 'sum', title: 'count' }}
  getRowOpenLabel={(row) => \`Abrir \${row.original.title}\`}
  isLoading={isLoading}
  loadingRowAnatomy={{ cell: 'control', lines: 2 }}
  loadingRowCount={5}
  onRowClick={(row) => open(row.original)}
  table={table}
/>
<DataGridPagination table={table} />
`

const docs = {
  api: [
    {
      description:
        'Semantic table over the COSS `Table` and a TanStack table from `useDataTable`. The consumer owns the columns and the state. `onRowClick` stretches a button over each row, named by `getRowOpenLabel`, while checkboxes, fields and buttons in cells keep their own click. A column with `meta.aggregations` gets a footer menu (Nenhum, Contagem, Soma) over every row before pagination, uncontrolled through `defaultAggregations` or controlled through `aggregations`. While `isLoading` it renders `loadingRowCount` skeleton rows shaped by `loadingRowAnatomy`: `lines` (1 or 2) in the first data column and `cell` (`text` or `control`) in the others, at the real cell heights. `bordered={false}` drops the frame.',
      name: 'DataTable',
    },
    {
      description:
        'Builds the TanStack table: `enablePagination` with `pageSize`, `enableRowSelection`, `enableColumnResizing` (a header handle, also driven by the arrow keys) and `getRowId`.',
      name: 'useDataTable',
    },
    {
      description:
        'The Colunas submenu for a `ViewSettingsMenu`: one checkbox per column that can hide, named by `meta.label` or the column id; it renders nothing when no column can hide.',
      name: 'DataTableColumnsSubmenu',
    },
  ],
  description: {
    component:
      '`DataTable` renders a collection as a semantic table. `Anatomy` shows the header, the rows, the footer and the frame, driven by the controls. `Usage` is the Tasks table with its toolbar and pagination. `Behavior` is the usage under test: it loads after a simulated delay keeping the row height, opens a task from its row, keeps the clicks of the checkbox and the status, totals in the footer, hides a column from the toolbar and pages forward and back.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-16 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

interface AnatomyRecord {
  id: string
  value: number
}

const anatomyRecords: AnatomyRecord[] = [
  { id: 'a', value: 1 },
  { id: 'b', value: 2 },
  { id: 'c', value: 3 },
]

const anatomyColumns: DataTableColumnDef<AnatomyRecord>[] = [
  {
    accessorKey: 'id',
    cell: () => <span className={slotClassName}>cell</span>,
    header: () => <span className={slotClassName}>header</span>,
  },
  {
    accessorKey: 'value',
    cell: () => <span className={slotClassName}>cell</span>,
    header: () => <span className={slotClassName}>header</span>,
    meta: { aggregations: ['count', 'sum'], label: 'Value' },
  },
]

function AnatomyTable({
  bordered,
  empty,
  isLoading,
  paginated,
  resizable,
}: Readonly<TableArgs>): ReactElement {
  const { table } = useDataTable<AnatomyRecord>({
    columns: anatomyColumns,
    data: empty ? [] : anatomyRecords,
    enableColumnResizing: resizable,
    enablePagination: paginated,
    getRowId: (record) => record.id,
    pageSize: 2,
  })

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        aria-label="Anatomy"
        bordered={bordered}
        defaultAggregations={{ value: 'sum' }}
        emptyMessage="emptyMessage"
        isLoading={isLoading}
        loadingRowCount={paginated ? 2 : 3}
        table={table}
      />
      {paginated ? <DataGridPagination table={table} /> : null}
    </div>
  )
}

function TasksTable({
  bordered,
  empty,
  isLoading,
  paginated,
  resizable,
}: Readonly<TableArgs>): ReactElement {
  const { tasks, updateTask } = useTasks(empty ? [] : initialTasks)
  const columns = useMemo(
    () => createDataTableColumns(updateTask),
    [updateTask],
  )
  const onRowClick = useMemo<DataTableProps<Task>['onRowClick']>(
    () => (row) => openTask(row.original),
    [],
  )
  const { table } = useDataTable<Task>({
    columns,
    data: tasks,
    enableColumnResizing: resizable,
    enablePagination: paginated,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: PAGE_SIZE,
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <CollectionToolbar
        endSlot={
          <ViewSettingsMenu onClearFilters={() => undefined}>
            <ViewSettingsSection label="Exibição">
              <DataTableColumnsSubmenu table={table} />
            </ViewSettingsSection>
          </ViewSettingsMenu>
        }
      />
      <DataTable
        aria-label="Tarefas do lançamento"
        bordered={bordered}
        defaultAggregations={taskTableAggregations}
        emptyMessage="Nenhuma tarefa para exibir."
        getRowOpenLabel={(row) => `Abrir ${row.original.title}`}
        isLoading={isLoading}
        loadingRowAnatomy={taskRowAnatomy}
        loadingRowCount={paginated ? PAGE_SIZE : initialTasks.length}
        onRowClick={onRowClick}
        table={table}
      />
      {paginated && !isLoading ? <DataGridPagination table={table} /> : null}
    </div>
  )
}

function LoadingTasksTable() {
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

  return (
    <TasksTable
      bordered
      empty={false}
      isLoading={isLoading}
      paginated
      resizable={false}
    />
  )
}

const meta = {
  args: {
    bordered: true,
    empty: false,
    isLoading: false,
    paginated: true,
    resizable: false,
  },
  argTypes: {
    bordered: { control: 'boolean' },
    empty: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    paginated: { control: 'boolean' },
    resizable: { control: 'boolean' },
  },
  component: TableDoc,
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-2rem)] max-w-[1280px] p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Collection/Layouts/Data Table',
} satisfies Meta<TableArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ args, canvasElement }) => {
    if (args.isLoading || args.empty) return
    await expect(
      within(canvasElement).getAllByRole('columnheader'),
    ).toHaveLength(2)
  },
  render: (args) => <AnatomyTable {...args} />,
}

export const Usage: Story = {
  render: (args) => <TasksTable {...args} />,
}

export const Behavior: Story = {
  argTypes: {
    bordered: hidden,
    empty: hidden,
    isLoading: hidden,
    paginated: hidden,
    resizable: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const table = canvas.getByRole('table', { name: 'Tarefas do lançamento' })
    const rows = () => [...table.querySelectorAll('tbody tr')]
    const pageOf = (page: number) =>
      initialTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const titles = () =>
      rows().map((row) =>
        row
          .querySelector('[data-slot="data-table-row-trigger"]')
          ?.getAttribute('aria-label')
          ?.replace('Abrir ', ''),
      )

    await expect(table).toHaveAttribute('aria-busy', 'true')
    await expect(rows()).toHaveLength(PAGE_SIZE)
    const skeletonRowHeight = rows()[0]?.getBoundingClientRect().height

    const [first, second] = pageOf(1)
    if (!(first && second)) throw new Error('The fixture has fewer tasks.')
    await canvas.findByRole(
      'checkbox',
      { name: `Selecionar ${first.title}` },
      { timeout: LOAD_DELAY * 2 },
    )
    await expect(table).not.toHaveAttribute('aria-busy')
    const tableHeight = table.getBoundingClientRect().height
    await expect(rows()[0]?.getBoundingClientRect().height).toBe(
      skeletonRowHeight,
    )

    openTask.mockClear()
    const plainCell = rows()[0]?.querySelectorAll('td')[1]
    if (!plainCell) throw new Error('The first row has no second cell.')
    const box = plainCell.getBoundingClientRect()
    const trigger = canvasElement.ownerDocument.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    )
    await expect(trigger).toHaveAccessibleName(`Abrir ${first.title}`)
    await userEvent.click(trigger as Element)
    await expect(openTask).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: first.id }),
    )

    const checkbox = canvas.getByRole('checkbox', {
      name: `Selecionar ${second.title}`,
    })
    await userEvent.click(checkbox)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(openTask).toHaveBeenCalledTimes(1)

    await userEvent.click(
      canvas.getAllByRole('combobox', { name: /^Status/ })[0] as Element,
    )
    await userEvent.click(
      await body.findByRole('option', { name: 'Em revisão' }),
    )
    await waitFor(() =>
      expect(
        canvas.getAllByRole('combobox', { name: /^Status/ })[0],
      ).toHaveAccessibleName(/Em revisão/),
    )
    await expect(openTask).toHaveBeenCalledTimes(1)

    await expect(
      canvas.getByRole('button', { name: /^Contagem / }),
    ).toHaveTextContent(String(initialTasks.length))

    await userEvent.click(canvas.getByRole('button', { name: /^Soma / }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Contagem' }),
    )
    await waitFor(() =>
      expect(
        canvas.getAllByRole('button', { name: /^Contagem / }),
      ).toHaveLength(2),
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Colunas' }),
    )
    await userEvent.click(
      await body.findByRole('menuitemcheckbox', {
        name: /Prioridade|priority/,
      }),
    )
    await expect(
      canvas.queryByRole('columnheader', { name: 'Prioridade' }),
    ).toBeNull()
    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Escape}')

    const goTo = async (name: string, page: number) => {
      await sleep(LOAD_DELAY)
      await userEvent.click(canvas.getByRole('button', { name }))
      await waitFor(() =>
        expect(titles()).toEqual(pageOf(page).map((task) => `${task.title}`)),
      )
      await expect(table.getBoundingClientRect().height).toBe(tableHeight)
    }
    await goTo('Próxima página', 2)
    await goTo('Página anterior', 1)
  },
  render: () => <LoadingTasksTable />,
}
