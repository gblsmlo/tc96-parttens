import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ActionBar,
  DataGrid,
  type DataGridColumnDef,
  type DataGridDensity,
  useDataGrid,
} from '@tc96/parttens'
import { ArchiveIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'
import { createDataGridColumns } from '../fixtures/task-fields'
import { useTasks } from '../fixtures/task-renderers'
import {
  initialTasks,
  people,
  statusOptions,
  type Task,
} from '../fixtures/tasks'

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

const meta = {
  argTypes: {
    density: {
      control: 'select',
      options: ['short', 'medium', 'tall', 'extra-tall'],
    },
    grouped: booleanArgType,
    fullHeight: booleanArgType,
    isLoading: booleanArgType,
    paginated: booleanArgType,
    selectable: booleanArgType,
  },
  component: DataGridExample,
  parameters: {
    docs: {
      description: {
        component:
          'DataGrid building block. Documents the column header, density, grouping, selection, pagination, loading and empty states over the launch tasks shared by every view. The table comes from `useDataGrid`; the consumer owns the columns.',
      },
    },
    layout: 'centered',
  },
  title: 'Patterns/CollectionViews/Views/Data Grid',
} satisfies Meta<typeof DataGridExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Paginated: Story = { args: { paginated: true } }

export const Grouped: Story = {
  args: { grouped: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', { name: 'Collapse Ana Souza' })

    await userEvent.click(toggle)
    await expect(canvas.queryByText('Implementar onboarding')).toBeNull()
    await expect(toggle.getAttribute('aria-expanded')).toBe('false')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Ana Souza' }),
    )
    await expect(canvas.getByText('Implementar onboarding')).toBeTruthy()
  },
}

function ControlledGroupsExample(): ReactElement {
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<readonly string[]>(
    ['Bruno Lima'],
  )

  return (
    <DataGridExample
      collapsedGroupIds={collapsedGroupIds}
      grouped
      onCollapsedGroupIdsChange={setCollapsedGroupIds}
    />
  )
}

export const GroupedControlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Whoever composes the grid keeps the collapsed groups, for example to remember them between visits. Bruno Lima starts collapsed.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByText('Revisar API de pagamentos')).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand Bruno Lima' }),
    )
    await expect(canvas.getByText('Revisar API de pagamentos')).toBeTruthy()
  },
  render: () => <ControlledGroupsExample />,
}

export const Selectable: Story = {
  args: { fullHeight: true, selectable: true },
}

const assigneeOptions = people.map((person) => ({
  label: person.name,
  value: person.id,
}))

function EditableExample(): ReactElement {
  const { tasks, updateTask } = useTasks()

  const editableColumns = useMemo<DataGridColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'title',
        enableHiding: false,
        header: 'Tarefa',
        meta: { label: 'Tarefa', type: 'title' },
        minSize: 240,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: {
          editable: true,
          label: 'Status',
          options: statusOptions.map(({ label, value }) => ({ label, value })),
          type: 'status',
          variant: 'select',
        },
        minSize: 170,
      },
      {
        accessorKey: 'assigneeId',
        header: 'Responsável',
        meta: {
          badgeVariant: 'outline',
          editable: true,
          label: 'Responsável',
          options: assigneeOptions,
          type: 'person',
          variant: 'select',
        },
        minSize: 190,
      },
    ],
    [],
  )

  const { table } = useDataGrid<Task>({
    columns: editableColumns,
    data: tasks,
    getRowId: (task) => task.id,
    onCellValueChange: ({ columnId, rowId, value }) =>
      updateTask(rowId, { [columnId]: value }),
  })

  return (
    <div className="p-4">
      <DataGrid aria-label="Tarefas do lançamento" table={table} />
    </div>
  )
}

export const EditableValues: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Status and Assignee are closed values, so the cell becomes a property with a trigger: the Badge opens the Select and the grid emits `onCellValueChange`. The consumer writes to the collection.',
      },
    },
  },
  render: () => <EditableExample />,
}

function FillExample({
  fillColumn,
}: Readonly<{ fillColumn?: string | false }>): ReactElement {
  const { tasks, updateTask } = useTasks(initialTasks.slice(0, 3))
  const columns = useMemo(
    () =>
      createDataGridColumns(updateTask).filter(
        (column) => column.id !== 'select',
      ),
    [updateTask],
  )
  const { table } = useDataGrid<Task>({
    columns,
    data: tasks,
    getRowId: (task) => task.id,
  })

  return (
    <DataGrid
      aria-label="Tarefas do lançamento"
      fillColumn={fillColumn}
      table={table}
    />
  )
}

export const FillColumn: Story = {
  play: async ({ canvasElement }) => {
    for (const grid of canvasElement.querySelectorAll(
      '[data-slot="data-grid"]',
    )) {
      const viewport = grid.querySelector('[data-slot="scroll-area-viewport"]')
      const body = grid.querySelector('[data-slot="data-grid-body"]')
      const header = grid.querySelector('[data-slot="data-grid-header"]')
      if (!(viewport && body && header)) throw new Error('grid não montou')

      await expect(viewport.scrollWidth).toBe(body.scrollWidth)
      await expect(header.scrollWidth).toBe(body.scrollWidth)
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'By default the last column grows to close the frame. `fillColumn` moves that role to another column. With `false` none grows and the frame shrinks to the sum of the columns; stretching it would leave a borderless strip on the right that reads as a ghost column. When the columns exceed the container, the grid scrolls.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      {(
        [
          ['Padrão: a última coluna cresce', undefined],
          ["fillColumn='title': a primeira cresce", 'title'],
          ['fillColumn={false}: nenhuma cresce, a moldura encolhe', false],
        ] as const
      ).map(([label, fillColumn]) => (
        <div className="flex flex-col gap-1" key={label}>
          <p className="font-medium text-muted-foreground text-sm">{label}</p>
          <FillExample fillColumn={fillColumn} />
        </div>
      ))}
    </div>
  ),
}

export const Densities: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      {(['short', 'medium', 'tall', 'extra-tall'] as const).map((density) => (
        <div className="flex flex-col gap-1" key={density}>
          <p className="font-medium text-muted-foreground text-sm">{density}</p>
          <DataGridExample data={initialTasks.slice(0, 3)} density={density} />
        </div>
      ))}
    </div>
  ),
}

export const Scrollable: Story = {
  args: { maxHeight: 160 },
  parameters: {
    docs: {
      description: {
        story:
          'With `maxHeight` the grid stops growing and scrolls inside, with the header stuck.',
      },
    },
  },
}

export const Loading: Story = { args: { isLoading: true } }

export const Empty: Story = { args: { data: [] } }
