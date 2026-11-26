import { Checkbox } from '@tc96/ui/checkbox'
import {
  CollectionToolbar,
  DataGridPagination,
  DataTable,
  type DataTableColumnDef,
  DataTableColumnsSubmenu,
  type DataTableProps,
  type DataTableRowSkeletonAnatomy,
  type DataTableTable,
  useDataTable,
  ViewSettings,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { type ReactElement, useCallback, useMemo } from 'react'
import {
  createDataTableColumns,
  taskTableAggregations,
} from '../collection/fixtures/task-fields'
import { useTasks } from '../collection/fixtures/task-renderers'
import { initialTasks, type Task } from '../collection/fixtures/tasks'
import type { DataTableControls } from './data-table-controls.ts'
import { PROJECT_PAGE_SIZE, type Project, projects } from './data-table-data.ts'

export const TASK_PAGE_SIZE = 5

const sumInHours = (value: number, aggregation: 'count' | 'sum') =>
  aggregation === 'sum' ? `${value} h` : String(value)

const selectColumn: DataTableColumnDef<Project> = {
  cell: ({ row }) => (
    <Checkbox
      aria-label={`Selecionar ${row.original.name}`}
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
    />
  ),
  enableResizing: false,
  header: ({ table }) => (
    <Checkbox
      aria-label="Selecionar todos os projetos"
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

const projectColumns = ({
  footer,
  selection,
}: Readonly<{ footer: boolean; selection: boolean }>) => {
  const columns: DataTableColumnDef<Project>[] = [
    {
      accessorKey: 'name',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
      header: 'Projeto',
      meta: footer
        ? { aggregations: ['count'], label: 'Projeto' }
        : { label: 'Projeto' },
      minSize: 160,
      size: 280,
    },
    {
      accessorKey: 'owner',
      header: 'Responsável',
      meta: { label: 'Responsável' },
      size: 200,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { label: 'Status' },
      size: 180,
    },
    {
      accessorKey: 'hours',
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.hours} h</span>
      ),
      header: 'Horas',
      meta: footer
        ? {
            aggregations: ['count', 'sum'],
            formatAggregation: sumInHours,
            label: 'Horas',
          }
        : { label: 'Horas' },
    },
  ]
  return selection ? [selectColumn, ...columns] : columns
}

const ColumnsToolbar = <TData extends object>({
  table,
}: Readonly<{ table: DataTableTable<TData> }>) => (
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

const ignoreProject = () => undefined

interface ProjectsTableProps extends DataTableControls {
  onOpen?: (project: Project) => void
}

function ProjectsTable({
  bordered,
  columnsMenu,
  empty,
  emptyMessage,
  footer,
  loading,
  loadingCell,
  loadingLines,
  onOpen = ignoreProject,
  pagination,
  resizable,
  rowClick,
  selectedRow,
  selection,
}: Readonly<ProjectsTableProps>): ReactElement {
  const columns = useMemo(
    () => projectColumns({ footer, selection }),
    [footer, selection],
  )
  const { table } = useDataTable<Project>({
    columns,
    data: empty ? [] : [...projects],
    enableColumnResizing: resizable,
    enablePagination: pagination,
    enableRowSelection: selection,
    getRowId: (project) => project.id,
    pageSize: PROJECT_PAGE_SIZE,
    ...(selectedRow
      ? { tableOptions: { initialState: { rowSelection: { 'P-102': true } } } }
      : {}),
  })
  const onRowOpen = useCallback<
    NonNullable<DataTableProps<Project>['onRowOpen']>
  >((row) => onOpen(row.original), [onOpen])

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {columnsMenu ? <ColumnsToolbar table={table} /> : null}
      <DataTable<Project>
        aria-label="Projetos do trimestre"
        bordered={bordered}
        defaultAggregations={footer ? { hours: 'sum', name: 'count' } : {}}
        emptyMessage={emptyMessage}
        loading={loading}
        loadingAnatomy={{ cell: loadingCell, lines: loadingLines }}
        loadingCount={pagination ? PROJECT_PAGE_SIZE : projects.length}
        table={table}
        {...(rowClick
          ? {
              getRowOpenLabel: (row: { original: Project }) =>
                `Abrir ${row.original.name}`,
              onRowOpen,
            }
          : {})}
      />
      {pagination && !loading ? <DataGridPagination table={table} /> : null}
    </div>
  )
}

export const ComposedDataTable = (props: Readonly<ProjectsTableProps>) => (
  <ProjectsTable
    {...props}
    key={[props.selectedRow, props.footer, props.selection].join()}
  />
)

const taskRowAnatomy: DataTableRowSkeletonAnatomy = {
  cell: 'control',
  lines: 2,
}

const ignoreTask = () => undefined

export function TasksTable({
  canOpen,
  loading = false,
  onOpen = ignoreTask,
}: Readonly<{
  canOpen?: (task: Task) => boolean
  loading?: boolean
  onOpen?: (task: Task) => void
}>): ReactElement {
  const { tasks, updateTask } = useTasks(initialTasks)
  const columns = useMemo(
    () => createDataTableColumns(updateTask),
    [updateTask],
  )
  const onRowOpen = useCallback<NonNullable<DataTableProps<Task>['onRowOpen']>>(
    (row) => onOpen(row.original),
    [onOpen],
  )
  const { table } = useDataTable<Task>({
    columns,
    data: tasks,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: TASK_PAGE_SIZE,
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <ColumnsToolbar table={table} />
      <DataTable
        aria-label="Tarefas do lançamento"
        defaultAggregations={taskTableAggregations}
        emptyMessage="Nenhuma tarefa para exibir."
        getRowCanOpen={canOpen ? (row) => canOpen(row.original) : undefined}
        getRowOpenLabel={(row) => `Abrir ${row.original.title}`}
        loading={loading}
        loadingAnatomy={taskRowAnatomy}
        loadingCount={TASK_PAGE_SIZE}
        onRowOpen={onRowOpen}
        table={table}
      />
      {loading ? null : <DataGridPagination table={table} />}
    </div>
  )
}
