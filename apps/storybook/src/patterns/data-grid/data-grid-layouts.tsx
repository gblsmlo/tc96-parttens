import {
  ArchiveIcon,
  PaperPlaneRightIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import {
  ActionBar,
  CollectionToolbar,
  createSelectColumn,
  DataGrid,
  type DataGridCellValueChange,
  type DataGridColumnDef,
  DataGridColumnsSubmenu,
  type DataGridDensity,
  DataGridDensitySubmenu,
  DataGridFilterMenu,
  DataGridSearch,
  DataGridSelectionSummary,
  DataGridSortSubmenu,
  type DataGridTable,
  useDataGrid,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { type ReactElement, useCallback, useMemo, useState } from 'react'
import { createDataGridColumns } from '../collection/fixtures/task-fields'
import { useTasks } from '../collection/fixtures/task-renderers'
import { initialTasks, people, type Task } from '../collection/fixtures/tasks'
import type { DataGridControls } from './data-grid-controls.ts'
import {
  GRID_PAGE_SIZE,
  type GridProject,
  gridProjects,
  projectPriorityOptions,
  projectStatusOptions,
} from './data-grid-data.ts'

export const TASK_PAGE_SIZE = 5

const ignore = () => undefined

const selectionActionBar = <TData,>({
  clearSelection,
  selectedCount,
  selectedRows,
}: Readonly<{
  clearSelection: () => void
  selectedCount: number
  selectedRows: readonly TData[]
}>) => (
  <ActionBar
    actions={[
      {
        items: [
          {
            icon: <PaperPlaneRightIcon aria-hidden="true" />,
            label: 'Enviar',
            onSelect: ignore,
            variant: 'primary',
          },
          {
            icon: <ArchiveIcon aria-hidden="true" />,
            label: 'Arquivar',
            onSelect: ignore,
          },
        ],
      },
      {
        items: [
          {
            label: 'Mais opções',
            submenu: [
              {
                items: [
                  { label: 'Duplicar', onSelect: ignore },
                  { label: 'Mover para…', onSelect: ignore },
                ],
                label: 'Organizar',
              },
              {
                items: [
                  {
                    icon: <TrashIcon aria-hidden="true" />,
                    label: 'Excluir',
                    onSelect: ignore,
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

const projectColumns = (
  selection: boolean,
): DataGridColumnDef<GridProject>[] => {
  const columns: DataGridColumnDef<GridProject>[] = [
    {
      accessorKey: 'name',
      header: 'Projeto',
      meta: { label: 'Projeto', type: 'title' },
      size: 220,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        editable: true,
        label: 'Status',
        options: projectStatusOptions,
        type: 'status',
        variant: 'select',
      },
      size: 160,
    },
    {
      accessorKey: 'owner',
      header: 'Responsável',
      meta: { label: 'Responsável', type: 'person' },
      size: 160,
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      meta: {
        badgeVariant: 'outline',
        label: 'Prioridade',
        options: projectPriorityOptions,
        type: 'select',
        variant: 'badge',
      },
      size: 130,
    },
    {
      accessorKey: 'due',
      header: 'Prazo',
      meta: { label: 'Prazo', type: 'date', variant: 'date' },
      size: 130,
    },
    {
      accessorKey: 'hours',
      header: 'Horas',
      meta: { align: 'end', label: 'Horas', type: 'number', variant: 'number' },
      size: 110,
    },
    {
      accessorKey: 'billable',
      header: 'Faturável',
      meta: {
        align: 'center',
        label: 'Faturável',
        type: 'checkbox',
        variant: 'checkbox',
      },
      size: 120,
    },
  ]
  return selection ? [createSelectColumn<GridProject>(), ...columns] : columns
}

const GridToolbar = <TData extends object>({
  table,
}: Readonly<{ table: DataGridTable<TData> }>) => (
  <CollectionToolbar
    right={
      <>
        <DataGridSelectionSummary table={table} />
        <DataGridFilterMenu table={table} />
        <ViewSettingsMenu onClearFilters={() => table.resetColumnFilters()}>
          <ViewSettingsSection label="Exibição">
            <DataGridSortSubmenu table={table} />
            <DataGridDensitySubmenu table={table} />
            <DataGridColumnsSubmenu table={table} />
          </ViewSettingsSection>
        </ViewSettingsMenu>
      </>
    }
    left={
      <DataGridSearch
        aria-label="Buscar projetos"
        placeholder="Buscar projetos…"
        table={table}
      />
    }
  />
)

function ProjectsGrid({
  addRow,
  density,
  empty,
  emptyMessage,
  fillColumn,
  grouped,
  isLoading,
  loadingCell,
  pagination,
  selectedRow,
  selection,
  selectionActions,
  toolbar,
}: Readonly<DataGridControls>): ReactElement {
  const [records, setRecords] = useState<GridProject[]>(() =>
    empty ? [] : [...gridProjects],
  )
  const columns = useMemo(() => projectColumns(selection), [selection])
  const onCellValueChange = useCallback(
    ({ columnId, rowId, value }: DataGridCellValueChange) =>
      setRecords((current) =>
        current.map((record) =>
          record.id === rowId ? { ...record, [columnId]: value } : record,
        ),
      ),
    [],
  )
  const addProject = useCallback(
    () =>
      setRecords((current) => [
        ...current,
        {
          billable: false,
          due: '2026-12-15',
          hours: 0,
          id: `P-${201 + current.length}`,
          name: 'Novo projeto',
          owner: 'Ana Lima',
          priority: 'low',
          status: 'planned',
        },
      ]),
    [],
  )
  const { table } = useDataGrid<GridProject>({
    columns,
    data: records,
    density,
    enablePagination: pagination,
    enableRowSelection: selection,
    getRowId: (record) => record.id,
    onCellValueChange,
    pageSize: GRID_PAGE_SIZE,
    ...(selectedRow
      ? { tableOptions: { initialState: { rowSelection: { 'P-102': true } } } }
      : {}),
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {toolbar ? <GridToolbar table={table} /> : null}
      <DataGrid<GridProject>
        aria-label="Projetos do trimestre"
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        loadingRowAnatomy={{ cell: loadingCell }}
        loadingRowCount={pagination ? GRID_PAGE_SIZE : gridProjects.length}
        table={table}
        {...(fillColumn ? {} : { fillColumn: false })}
        {...(grouped
          ? { getRowGroup: (record: GridProject) => record.owner }
          : {})}
        {...(addRow ? { onRowAdd: addProject } : {})}
        {...(selectionActions
          ? { selectionActions: selectionActionBar<GridProject> }
          : {})}
      />
    </div>
  )
}

export const ComposedDataGrid = (props: Readonly<DataGridControls>) => (
  <ProjectsGrid
    {...props}
    key={[props.density, props.empty, props.selectedRow].join()}
  />
)

const assigneeOrder = people.map((person) => person.id)

const sortByAssignee = (tasks: readonly Task[]) =>
  [...tasks].sort(
    (a, b) =>
      assigneeOrder.indexOf(a.assigneeId) - assigneeOrder.indexOf(b.assigneeId),
  )

const assigneeName = (task: Task) =>
  people.find((person) => person.id === task.assigneeId)?.name ?? null

export function TasksGrid({
  density = 'medium',
  grouped = false,
  isLoading = false,
}: Readonly<{
  density?: DataGridDensity
  grouped?: boolean
  isLoading?: boolean
}>): ReactElement {
  const { tasks, updateTask } = useTasks(initialTasks)
  const columns = useMemo(() => createDataGridColumns(updateTask), [updateTask])
  const rows = useMemo(
    () => (grouped ? sortByAssignee(tasks) : tasks),
    [grouped, tasks],
  )
  const { table } = useDataGrid<Task>({
    columns,
    data: rows,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (task) => task.id,
    pageSize: TASK_PAGE_SIZE,
  })

  return (
    <DataGrid
      aria-label="Tarefas do lançamento"
      density={density}
      emptyMessage="Nenhuma tarefa para exibir."
      isLoading={isLoading}
      loadingRowAnatomy={{ cell: 'control' }}
      loadingRowCount={TASK_PAGE_SIZE}
      selectionActions={selectionActionBar<Task>}
      table={table}
      {...(grouped ? { getRowGroup: assigneeName } : {})}
    />
  )
}
