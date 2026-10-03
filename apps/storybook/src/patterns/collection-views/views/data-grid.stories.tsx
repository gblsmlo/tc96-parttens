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
  /** Densidade vertical das linhas. */
  density?: DataGridDensity
  /** Troca as linhas por esqueletos de carregamento. */
  isLoading?: boolean
  /** Agrupa linhas consecutivas que compartilham o responsável. */
  grouped?: boolean
  /** Grupos recolhidos, quando o estado fica com quem compõe o grid. */
  collapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  /** Liga a coluna de seleção e a caixa de seleção por linha. */
  selectable?: boolean
  /** Pagina no cliente. O rodapé de paginação vem junto, sem wiring extra. */
  paginated?: boolean
  /** Coleção exibida. Passe uma lista vazia para ver a mensagem de vazio. */
  data?: Task[]
  /** Teto de altura. Sem ele o grid tem a altura do conteúdo; com ele, rola por dentro. */
  maxHeight?: number
  /** Expande a composição até a altura disponível para validar ações ancoradas no rodapé. */
  fullHeight?: boolean
}

/**
 * Compõe `useDataGrid` e `DataGrid` do jeito que um consumidor compõe: o hook
 * monta a tabela, o grid desenha, e a paginação é opcional.
 */
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
          'Building Block de DataGrid. Documenta cabeçalho de coluna, densidade, agrupamento, seleção, paginação, carregamento e vazio — sobre as tarefas do lançamento compartilhadas por todas as views. A tabela vem de `useDataGrid`; o consumidor é dono das colunas.',
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

/**
 * Quem compõe o grid guarda os grupos recolhidos — por exemplo, para
 * lembrá-los entre visitas. Bruno Lima começa recolhido.
 */
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

/**
 * Colunas de valor fechado viram property com trigger: o Badge abre o Select e
 * emite `onCellValueChange`. A mutação continua sendo do consumer — o grid não
 * escreve na coleção, só avisa o que mudou.
 */
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
          'Status e Responsável são valores fechados, então a célula vira property com trigger: o Badge abre o Select e o grid emite `onCellValueChange`. Quem escreve na coleção é o consumer.',
      },
    },
  },
  render: () => <EditableExample />,
}

/**
 * A última coluna absorve a sobra horizontal, senão o grid terminaria antes da
 * borda. `fillColumn` escolhe outra coluna, ou `false` desliga o preenchimento e
 * cada coluna fica com a largura declarada.
 */
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
    // Rolagem além do conteúdo abre uma faixa vazia à direita, que se lê como
    // uma coluna a mais: o punho de redimensionar da última coluna somava 8px.
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
          'Por omissão a última coluna cresce para fechar a moldura. `fillColumn` move esse papel para outra coluna. Com `false` nenhuma cresce e a moldura encolhe para a soma das colunas — esticar ali deixaria uma faixa sem borda à direita, que se lê como coluna fantasma. Passando das colunas o container, o grid rola.',
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

/** Com `maxHeight` o grid para de crescer e passa a rolar por dentro, com o
 *  cabeçalho grudado. */
export const Scrollable: Story = { args: { maxHeight: 160 } }

export const Loading: Story = { args: { isLoading: true } }

export const Empty: Story = { args: { data: [] } }
