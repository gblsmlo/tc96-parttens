import {
  createSelectColumn,
  type DataGridColumnDef,
  type DataTableColumnDef,
  DateProperty,
  PersonProperty,
  type PersonPropertyOption,
  SelectProperty,
  TextProperty,
} from '@tc96/parttens'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  isPriority,
  isStatus,
  NOW,
  people,
  priorityOptions,
  statusOptions,
  type Task,
  TIME_ZONE,
} from './tasks'

export type TaskChange = Partial<Omit<Task, 'id'>>
export type UpdateTask = (id: string, change: TaskChange) => void

export function StatusField({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  return (
    <SelectProperty
      ariaLabel="Status"
      onValueChange={(value) => {
        if (value && isStatus(value)) onChange(task.id, { status: value })
      }}
      options={statusOptions}
      value={task.status}
    />
  )
}

export const personOptions: readonly PersonPropertyOption[] = people.map(
  (person) => ({
    fallback: person.initials,
    label: person.name,
    value: person.id,
  }),
)

export function AssigneeField({
  display = 'full',
  onChange,
  task,
  variant,
}: Readonly<{
  display?: 'avatar' | 'full'
  onChange: UpdateTask
  task: Task
  variant?: 'badge' | 'plain'
}>) {
  return (
    <PersonProperty
      ariaLabel="Responsável"
      display={display}
      onValueChange={(value) => onChange(task.id, { assigneeId: value })}
      options={personOptions}
      value={task.assigneeId}
      variant={variant}
    />
  )
}

export const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: TIME_ZONE,
  year: 'numeric',
})

/** Dia civil no fuso da coleção, como `YYYY-MM-DD`. */
export const dayKey = (iso: string) => dayKeyFormatter.format(new Date(iso))

export const dueOf = (task: Task) => task.end ?? task.start

/**
 * Mudar o prazo desloca a janela inteira pelos dias de diferença: início e fim
 * andam juntos, e o horário de cada um se mantém — o Calendário segue coerente.
 */
export const moveDue = (task: Task, picked: string): TaskChange => {
  const delta =
    Date.parse(`${dayKey(picked)}T00:00:00Z`) -
    Date.parse(`${dayKey(dueOf(task))}T00:00:00Z`)
  const shift = (iso: string) => new Date(Date.parse(iso) + delta).toISOString()

  return { end: task.end ? shift(task.end) : null, start: shift(task.start) }
}

export function DueField({
  onChange,
  task,
  variant,
}: Readonly<{
  onChange: UpdateTask
  task: Task
  variant?: 'badge' | 'plain'
}>) {
  return (
    <DateProperty
      allowClear={false}
      ariaLabel="Prazo"
      isOverdue={
        task.status !== 'done' && Date.parse(dueOf(task)) < NOW.getTime()
      }
      locale="pt-BR"
      onValueChange={(value) => {
        if (value) onChange(task.id, moveDue(task, value))
      }}
      timeZone={TIME_ZONE}
      value={dueOf(task)}
      variant={variant}
    />
  )
}

export function EstimateField({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  return (
    <TextProperty
      ariaLabel="Estimativa"
      editing="inline"
      fallback="Sem estimativa"
      inputPlaceholder="Ex.: 8 h"
      onCommit={(value) => {
        const hours = Number.parseFloat(value ?? '')
        onChange(task.id, {
          estimate: Number.isFinite(hours) && hours >= 0 ? hours : 0,
        })
      }}
      value={`${task.estimate} h`}
    />
  )
}

export function PriorityField({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  return (
    <SelectProperty
      ariaLabel="Prioridade"
      onValueChange={(value) => {
        if (value && isPriority(value)) onChange(task.id, { priority: value })
      }}
      options={priorityOptions}
      value={task.priority}
    />
  )
}

// ─── Colunas das tabelas ────────────────────────────────────────────────────

/**
 * As células da planilha são as properties da UI: o grid só posiciona, e cada
 * property abre o próprio controle e avisa a troca para a coleção.
 */
export const createDataGridColumns = (
  onChange: UpdateTask,
): DataGridColumnDef<Task>[] => [
  createSelectColumn<Task>(),
  {
    accessorKey: 'title',
    enableHiding: false,
    header: 'Tarefa',
    meta: { label: 'Tarefa', type: 'title' },
    minSize: 240,
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => <StatusField onChange={onChange} task={row.original} />,
    header: 'Status',
    meta: { label: 'Status', type: 'status' },
    minSize: 170,
  },
  {
    accessorKey: 'priority',
    cell: ({ row }) => (
      <PriorityField onChange={onChange} task={row.original} />
    ),
    header: 'Prioridade',
    meta: { label: 'Prioridade', type: 'select' },
    minSize: 150,
  },
  {
    accessorKey: 'assigneeId',
    cell: ({ row }) => (
      <AssigneeField onChange={onChange} task={row.original} />
    ),
    header: 'Responsável',
    meta: { label: 'Responsável', type: 'person' },
    minSize: 190,
  },
  {
    accessorFn: dueOf,
    cell: ({ row }) => <DueField onChange={onChange} task={row.original} />,
    header: 'Prazo',
    id: 'due',
    meta: { label: 'Prazo', type: 'date' },
    minSize: 150,
  },
  {
    accessorKey: 'estimate',
    cell: ({ row }) => (
      <EstimateField onChange={onChange} task={row.original} />
    ),
    header: 'Estimativa',
    meta: { label: 'Estimativa', type: 'number' },
    minSize: 150,
  },
]

export const createDataTableColumns = (
  onChange: UpdateTask,
): DataTableColumnDef<Task>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Selecionar ${row.original.title}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
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
  },
  {
    accessorKey: 'title',
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{row.original.title}</span>
        <span className="truncate text-muted-foreground text-xs">
          {row.original.id} · {row.original.description}
        </span>
      </div>
    ),
    footer: ({ table }) => `${table.getRowCount()} tarefas`,
    header: 'Tarefa',
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => <StatusField onChange={onChange} task={row.original} />,
    header: 'Status',
  },
  {
    accessorKey: 'priority',
    cell: ({ row }) => (
      <PriorityField onChange={onChange} task={row.original} />
    ),
    header: 'Prioridade',
  },
  {
    accessorKey: 'assigneeId',
    cell: ({ row }) => (
      <AssigneeField onChange={onChange} task={row.original} />
    ),
    header: 'Responsável',
  },
  {
    cell: ({ row }) => <DueField onChange={onChange} task={row.original} />,
    header: 'Prazo',
    id: 'due',
  },
  {
    accessorKey: 'estimate',
    cell: ({ row }) => (
      <EstimateField onChange={onChange} task={row.original} />
    ),
    footer: ({ table }) => (
      <span className="tabular-nums">
        {table
          .getPrePaginatedRowModel()
          .rows.reduce((sum, row) => sum + row.original.estimate, 0)}{' '}
        h
      </span>
    ),
    header: 'Estimativa',
  },
]
