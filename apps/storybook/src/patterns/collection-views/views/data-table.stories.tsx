import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGridPagination, DataTable, useDataTable } from '@tc96/parttens'
import { type ReactElement, useMemo } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'
import { createDataTableColumns } from '../fixtures/task-fields'
import { useTasks } from '../fixtures/task-renderers'
import { initialTasks, type Task } from '../fixtures/tasks'

interface DataTableExampleProps {
  /** Displayed collection. Pass an empty list to see the empty message. */
  data?: Task[]
  /** Replaces the rows with loading skeletons. */
  isLoading?: boolean
  /** Paginates on the client and composes the pagination footer below the table. */
  paginated?: boolean
  /** Lets the user resize columns from the header edges. */
  resizable?: boolean
}

function DataTableExample({
  data = initialTasks,
  isLoading = false,
  paginated = false,
  resizable = false,
}: Readonly<DataTableExampleProps>): ReactElement {
  const { tasks, updateTask } = useTasks(data)
  const columns = useMemo(
    () => createDataTableColumns(updateTask),
    [updateTask],
  )
  const { table } = useDataTable<Task>({
    columns,
    data: tasks,
    enableColumnResizing: resizable,
    enablePagination: paginated,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: 5,
  })

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 p-4">
      <DataTable
        aria-label="Tarefas do lançamento"
        emptyMessage="Nenhuma tarefa para exibir."
        isLoading={isLoading}
        table={table}
      />
      {paginated ? <DataGridPagination table={table} /> : null}
    </div>
  )
}

const meta = {
  argTypes: {
    isLoading: booleanArgType,
    paginated: booleanArgType,
    resizable: booleanArgType,
  },
  component: DataTableExample,
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-2rem)] max-w-[1280px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Semantic table collection view, built on the COSS `Table` and TanStack Table. The view draws the DataGrid frame by default (`bordered={false}` drops it) and is not a child of `CardFrame`. The consumer owns the columns and the state; the footer appears when a column declares `footer`. Status is a `SelectProperty`: the select emits the change and the example writes to the collection.',
      },
    },
    layout: 'centered',
  },
  title: 'Patterns/CollectionViews/Views/Data Table',
} satisfies Meta<typeof DataTableExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('14 tarefas')).toBeTruthy()
    await expect(canvas.getByText('89 h')).toBeTruthy()
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Selecionar todas as tarefas' }),
    )
    await expect(
      canvasElement.querySelectorAll('tbody tr[data-state="selected"]'),
    ).toHaveLength(initialTasks.length)
    await expect(
      canvasElement.querySelector('[data-slot="card-frame"]'),
    ).toBeNull()
  },
}

export const EditStatus: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Changing the status through the select rewrites the row in the example collection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      (await canvas.findAllByRole('combobox', { name: 'Status: Backlog' }))[0],
    )
    await userEvent.click(
      await body.findByRole('option', { name: 'Em revisão' }),
    )
    await expect(
      canvas.getAllByRole('combobox', { name: 'Status: Backlog' }),
    ).toHaveLength(1)
    await expect(
      canvas.getAllByRole('combobox', { name: 'Status: Em revisão' }),
    ).toHaveLength(3)
  },
}

export const ResizableColumns: Story = {
  args: { resizable: true },
  parameters: {
    docs: {
      description: {
        story:
          'Drag a header edge, or focus it and press the arrow keys, to resize a column; a double click restores its `size`. The last column takes the remaining width, so the table keeps filling its container until the sized columns overflow it and it scrolls.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table')
    const container = table.parentElement as HTMLElement
    const handle = canvas.getByRole('separator', {
      name: 'Redimensionar coluna Tarefa',
    })

    await expect(table.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      container.clientWidth,
    )
    handle.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(handle).toHaveAttribute('aria-valuenow', '328')
    await expect(table.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      container.clientWidth,
    )
    await expect(
      canvas.queryByRole('separator', {
        name: 'Redimensionar coluna Estimativa',
      }),
    ).toBeNull()
  },
}

export const Paginated: Story = { args: { paginated: true } }

export const Loading: Story = { args: { isLoading: true } }

export const Empty: Story = { args: { data: [] } }
