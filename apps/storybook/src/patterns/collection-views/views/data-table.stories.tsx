import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGridPagination, DataTable, useDataTable } from '@tc96/parttens'
import { type ReactElement, useMemo } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'
import { createDataTableColumns } from '../fixtures/task-fields'
import { useTasks } from '../fixtures/task-renderers'
import { initialTasks, type Task } from '../fixtures/tasks'

interface DataTableExampleProps {
  /** Coleção exibida. Passe uma lista vazia para ver a mensagem de vazio. */
  data?: Task[]
  /** Troca as linhas por esqueletos de carregamento. */
  isLoading?: boolean
  /** Pagina no cliente e compõe o rodapé de paginação abaixo da tabela. */
  paginated?: boolean
}

/**
 * Compõe `useDataTable` e `DataTable` do jeito que um consumidor compõe: o
 * hook monta a tabela, a view desenha. Sem `CardFrame` — a tabela fica solta.
 */
function DataTableExample({
  data = initialTasks,
  isLoading = false,
  paginated = false,
}: Readonly<DataTableExampleProps>): ReactElement {
  const { tasks, updateTask } = useTasks(data)
  const columns = useMemo(
    () => createDataTableColumns(updateTask),
    [updateTask],
  )
  const { table } = useDataTable<Task>({
    columns,
    data: tasks,
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
  },
  component: DataTableExample,
  decorators: [
    // Ocupa a largura do canvas até 1280px; acima disso, fica centralizada.
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
          'Collection view em tabela semântica, sobre a `Table` do COSS e o TanStack Table. A view não traz moldura: não é filha de `CardFrame`. O consumidor é dono das colunas e do estado; o rodapé aparece quando alguma coluna declara `footer`. O status é um `SelectProperty`: o select emite a troca e o exemplo escreve na coleção.',
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

/** Trocar o status pelo select reescreve a linha na coleção do exemplo. */
export const EditStatus: Story = {
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

export const Paginated: Story = { args: { paginated: true } }

export const Loading: Story = { args: { isLoading: true } }

export const Empty: Story = { args: { data: [] } }
