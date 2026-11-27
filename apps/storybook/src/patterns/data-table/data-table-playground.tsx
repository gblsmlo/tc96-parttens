import { Checkbox } from '@tc96/ui/checkbox'
import {
  CollectionToolbar,
  DataGridPagination,
  DataTable,
  type DataTableColumnDef,
  DataTableColumnsSubmenu,
  DataTableDescription,
  type DataTableProps,
  type DataTableTable,
  DataTableTitle,
  DataTableTitleCell,
  useDataTable,
  ViewSettings,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { type ReactElement, useCallback, useMemo } from 'react'
import { DescriptionSegments } from '../collection/fixtures/description-segments'
import {
  AssigneeField,
  DueField,
  EstimateField,
  PriorityField,
  StatusField,
  type UpdateTask,
} from '../collection/fixtures/task-fields'
import { useTasks } from '../collection/fixtures/task-renderers'
import { initialTasks, type Task } from '../collection/fixtures/tasks'
import type { DataTableControls } from './data-table-controls.ts'

export const PLAYGROUND_PAGE_SIZE = 5

const sumInHours = (value: number, aggregation: 'count' | 'sum') =>
  aggregation === 'sum' ? `${value} h` : String(value)

const selectColumn: DataTableColumnDef<Task> = {
  cell: ({ row }) => (
    <Checkbox
      aria-label={`Selecionar ${row.original.title}`}
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
    />
  ),
  enableResizing: false,
  header: ({ table }) => (
    <Checkbox
      aria-label="Selecionar todas as tarefas"
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
      }
      onCheckedChange={(value) =>
        table.toggleAllPageRowsSelected(Boolean(value))
      }
    />
  ),
  id: 'select',
  size: 40,
}

const taskColumns = ({
  footer,
  onChange,
  selection,
}: Readonly<{
  footer: boolean
  onChange: UpdateTask
  selection: boolean
}>) => {
  const columns: DataTableColumnDef<Task>[] = [
    {
      accessorKey: 'title',
      cell: ({ row }) => (
        <DataTableTitleCell>
          <DataTableTitle>{row.original.title}</DataTableTitle>
          <DataTableDescription>
            <DescriptionSegments
              segments={[row.original.id, row.original.description]}
            />
          </DataTableDescription>
        </DataTableTitleCell>
      ),
      header: 'Tarefa',
      meta: footer
        ? { aggregations: ['count'], label: 'Tarefa' }
        : { label: 'Tarefa' },
      minSize: 200,
      size: 320,
    },
    {
      accessorKey: 'status',
      cell: ({ row }) => (
        <StatusField onChange={onChange} task={row.original} variant="plain" />
      ),
      header: 'Status',
      meta: { label: 'Status' },
      size: 160,
    },
    {
      accessorKey: 'priority',
      cell: ({ row }) => (
        <PriorityField
          onChange={onChange}
          task={row.original}
          variant="plain"
        />
      ),
      header: 'Prioridade',
      meta: { label: 'Prioridade' },
      size: 140,
    },
    {
      accessorKey: 'assigneeId',
      cell: ({ row }) => (
        <AssigneeField
          onChange={onChange}
          task={row.original}
          variant="plain"
        />
      ),
      header: 'Responsável',
      meta: { label: 'Responsável' },
      size: 180,
    },
    {
      cell: ({ row }) => (
        <DueField onChange={onChange} task={row.original} variant="plain" />
      ),
      header: 'Prazo',
      id: 'due',
      meta: { label: 'Prazo' },
      size: 140,
    },
    {
      accessorKey: 'estimate',
      cell: ({ row }) => (
        <EstimateField
          onChange={onChange}
          task={row.original}
          variant="plain"
        />
      ),
      header: 'Estimativa',
      meta: footer
        ? {
            aggregations: ['count', 'sum'],
            formatAggregation: sumInHours,
            label: 'Estimativa',
          }
        : { label: 'Estimativa' },
    },
  ]
  return selection ? [selectColumn, ...columns] : columns
}

const ColumnsToolbar = ({
  table,
}: Readonly<{ table: DataTableTable<Task> }>) => (
  <CollectionToolbar
    right={
      <ViewSettings onClearFilters={() => undefined}>
        <ViewSettingsSection label="Exibição">
          <DataTableColumnsSubmenu table={table} />
        </ViewSettingsSection>
      </ViewSettings>
    }
  />
)

const ignoreTask = () => undefined

const secondTaskId = initialTasks[1]?.id ?? ''

interface PlaygroundTableProps extends DataTableControls {
  onOpen?: (task: Task) => void
}

function PlaygroundTable({
  bordered,
  columnsMenu,
  empty,
  emptyMessage,
  footer,
  loading,
  loadingCell,
  loadingLines,
  onOpen = ignoreTask,
  pagination,
  resizable,
  rowClick,
  selectedRow,
  selection,
}: Readonly<PlaygroundTableProps>): ReactElement {
  const { tasks, updateTask } = useTasks(initialTasks)
  const columns = useMemo(
    () => taskColumns({ footer, onChange: updateTask, selection }),
    [footer, selection, updateTask],
  )
  const { table } = useDataTable<Task>({
    columns,
    data: empty ? [] : tasks,
    enableColumnResizing: resizable,
    enablePagination: pagination,
    enableRowSelection: selection,
    getRowId: (task) => task.id,
    pageSize: PLAYGROUND_PAGE_SIZE,
    ...(selectedRow
      ? {
          tableOptions: {
            initialState: { rowSelection: { [secondTaskId]: true } },
          },
        }
      : {}),
  })
  const onRowOpen = useCallback<NonNullable<DataTableProps<Task>['onRowOpen']>>(
    (row) => onOpen(row.original),
    [onOpen],
  )

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {columnsMenu ? <ColumnsToolbar table={table} /> : null}
      <DataTable<Task>
        aria-label="Tarefas do lançamento"
        bordered={bordered}
        defaultAggregations={footer ? { estimate: 'sum', title: 'count' } : {}}
        emptyMessage={emptyMessage}
        loading={loading}
        loadingAnatomy={{ cell: loadingCell, lines: loadingLines }}
        loadingCount={pagination ? PLAYGROUND_PAGE_SIZE : tasks.length}
        table={table}
        {...(rowClick
          ? {
              getRowOpenLabel: (row: { original: Task }) =>
                `Abrir ${row.original.title}`,
              onRowOpen,
            }
          : {})}
      />
      {pagination && !loading ? <DataGridPagination table={table} /> : null}
    </div>
  )
}

export const PlaygroundDataTable = (props: Readonly<PlaygroundTableProps>) => (
  <PlaygroundTable
    {...props}
    key={[props.selectedRow, props.footer, props.selection].join()}
  />
)
