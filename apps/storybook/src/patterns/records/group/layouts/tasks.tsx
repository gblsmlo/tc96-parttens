import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupDivider,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupLink,
  RecordGroupSubgroup,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  CalendarClockIcon,
  CalendarIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  FileCheckIcon,
  FlagIcon,
  ListTodoIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SigmaIcon,
  Trash2Icon,
  VideoIcon,
} from 'lucide-react'
import { Fragment, type ReactNode, useState } from 'react'

interface TaskEntry {
  completed: boolean
  due: string
  id: string
  kind: 'task'
  title: string
}

interface AgendaLinkEntry {
  href: string
  id: string
  kind: 'deadline' | 'event'
  meta: string
  title: string
}

type AgendaEntry = (TaskEntry | AgendaLinkEntry) & { date: string }

type AgendaKind = AgendaEntry['kind']

type AgendaSort = 'date-asc' | 'date-desc' | 'kind'

const agendaKinds: readonly { label: string; value: AgendaKind }[] = [
  { label: 'Tarefas', value: 'task' },
  { label: 'Prazos', value: 'deadline' },
  { label: 'Eventos', value: 'event' },
]

const agendaSorts: readonly { label: string; value: AgendaSort }[] = [
  { label: 'Data mais próxima', value: 'date-asc' },
  { label: 'Data mais distante', value: 'date-desc' },
  { label: 'Tipo', value: 'kind' },
]

const sortAgenda = (entries: readonly AgendaEntry[], sort: AgendaSort) =>
  [...entries].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date)
    if (sort === 'date-desc') return -byDate
    if (sort === 'kind')
      return (
        agendaKinds.findIndex((kind) => kind.value === a.kind) -
          agendaKinds.findIndex((kind) => kind.value === b.kind) || byDate
      )
    return byDate
  })

const ignore = (..._values: unknown[]) => undefined
const onOpenTask = ignore
const onEditTask = ignore
const onPostponeTask = ignore
const onDeleteTask = ignore

const tasks: readonly TaskEntry[] = [
  {
    completed: false,
    due: '18/11/2026',
    id: 'power-of-attorney',
    kind: 'task',
    title: 'Enviar procuração ao cliente',
  },
  {
    completed: false,
    due: '20/11/2026',
    id: 'fee-contract',
    kind: 'task',
    title: 'Revisar contrato de honorários',
  },
  {
    completed: false,
    due: '24/11/2026',
    id: 'petition',
    kind: 'task',
    title:
      'Protocolar petição inicial da ação revisional bancária com os extratos anexos',
  },
  {
    completed: true,
    due: '12/11/2026',
    id: 'statements',
    kind: 'task',
    title: 'Baixar extratos de 2024',
  },
]

const agenda: readonly AgendaEntry[] = [
  {
    completed: false,
    due: '20/11/2026',
    date: '2026-11-20',
    id: 'fee-contract',
    kind: 'task',
    title: 'Revisar contrato de honorários',
  },
  {
    href: '#/prazos/contestacao',
    date: '2026-11-25',
    id: 'answer',
    kind: 'deadline',
    meta: '25/11/2026',
    title: 'Prazo da contestação',
  },
  {
    href: '#/agenda/audiencia-de-conciliacao',
    date: '2026-11-27T14:00',
    id: 'hearing',
    kind: 'event',
    meta: '27/11 14:00',
    title: 'Audiência de conciliação',
  },
  {
    completed: false,
    due: '24/11/2026',
    date: '2026-11-24',
    id: 'petition',
    kind: 'task',
    title: 'Protocolar petição inicial',
  },
  {
    href: '#/agenda/reuniao-com-cliente',
    date: '2026-12-02T10:30',
    id: 'meeting',
    kind: 'event',
    meta: '02/12 10:30',
    title: 'Reunião com o cliente',
  },
]

const kindIcon = {
  deadline: { color: '#dc2626', icon: FlagIcon },
  event: { color: '#2563eb', icon: CalendarIcon },
} as const

type TodoStatus = 'open' | 'overdue' | 'done'

type TodoSort = 'date-asc' | 'date-desc'

type DeadlineStatus = 'open' | 'overdue' | 'filed'

type Modality = 'in_person' | 'video'

type EventStatus = 'today' | 'scheduled' | 'done'

type TodoSection = 'deadlines' | 'events' | 'tasks'

interface Deadline {
  date: string
  fatal: string
  href: string
  id: string
  label: string
  responsible: string
  status: DeadlineStatus
}

interface ProcessEvent {
  date: string
  href: string
  id: string
  modality: Modality
  responsible: string
  status: EventStatus
  time: string
  title: string
}

type ProcessTask = TaskEntry & { date: string; responsible: string }

const today = '2026-11-19'

const onOpenDeadline = ignore
const onFileDeadline = ignore
const onShowCount = ignore
const onDeleteDeadline = ignore
const onAddTodo = ignore

const todoStatusOptions: readonly { label: string; value: TodoStatus }[] = [
  { label: 'Em aberto', value: 'open' },
  { label: 'Vencido', value: 'overdue' },
  { label: 'Concluído', value: 'done' },
]

const responsibleOptions: readonly { label: string; value: string }[] = [
  { label: 'Ana Ribeiro', value: 'ana' },
  { label: 'Bruno Tavares', value: 'bruno' },
]

const todoSorts: readonly { label: string; value: TodoSort }[] = [
  { label: 'Data mais próxima', value: 'date-asc' },
  { label: 'Data mais distante', value: 'date-desc' },
]

const deadlineStatus = {
  filed: {
    color: 'var(--success-foreground)',
    label: 'Protocolado',
    todo: 'done',
  },
  open: { color: 'var(--muted-foreground)', label: 'Em aberto', todo: 'open' },
  overdue: {
    color: 'var(--destructive-foreground)',
    label: 'Vencido',
    todo: 'overdue',
  },
} as const satisfies Record<
  DeadlineStatus,
  { color: string; label: string; todo: TodoStatus }
>

const processEventStatus = {
  done: {
    color: 'var(--success-foreground)',
    label: 'Realizado',
    todo: 'done',
  },
  scheduled: {
    color: 'var(--info-foreground)',
    label: 'Agendado',
    todo: 'open',
  },
  today: { color: 'var(--warning-foreground)', label: 'Hoje', todo: 'open' },
} as const satisfies Record<
  EventStatus,
  { color: string; label: string; todo: TodoStatus }
>

const modalityFrame = {
  in_person: { color: '#ea580c', icon: MapPinIcon },
  video: { color: '#2563eb', icon: VideoIcon },
} as const

const deadlineColor = '#dc2626'

const deadlines: readonly Deadline[] = [
  {
    date: '2026-11-25',
    fatal: '25/11/2026',
    href: '#/prazos/contestacao',
    id: 'answer',
    label: 'Contestação',
    responsible: 'ana',
    status: 'open',
  },
  {
    date: '2026-11-14',
    fatal: '14/11/2026',
    href: '#/prazos/manifestacao-sobre-o-laudo',
    id: 'expert-report',
    label: 'Manifestação sobre o laudo pericial',
    responsible: 'bruno',
    status: 'overdue',
  },
  {
    date: '2026-11-06',
    fatal: '06/11/2026',
    href: '#/prazos/replica',
    id: 'reply',
    label: 'Réplica',
    responsible: 'ana',
    status: 'filed',
  },
]

const processEvents: readonly ProcessEvent[] = [
  {
    date: '2026-11-19T14:00',
    href: '#/agenda/audiencia-de-conciliacao',
    id: 'conciliation',
    modality: 'in_person',
    responsible: 'ana',
    status: 'today',
    time: '19/11 14:00',
    title: 'Audiência de conciliação',
  },
  {
    date: '2026-11-27T10:30',
    href: '#/agenda/reuniao-com-o-cliente',
    id: 'client-meeting',
    modality: 'video',
    responsible: 'bruno',
    status: 'scheduled',
    time: '27/11 10:30',
    title: 'Reunião com o cliente',
  },
  {
    date: '2026-11-05T09:30',
    href: '#/agenda/sessao-de-mediacao',
    id: 'mediation',
    modality: 'in_person',
    responsible: 'ana',
    status: 'done',
    time: '05/11 09:30',
    title: 'Sessão de mediação',
  },
]

const processTasks: readonly ProcessTask[] = [
  {
    completed: false,
    date: '2026-11-18',
    due: '18/11/2026',
    id: 'power-of-attorney',
    kind: 'task',
    responsible: 'ana',
    title: 'Enviar procuração ao cliente',
  },
  {
    completed: false,
    date: '2026-11-20',
    due: '20/11/2026',
    id: 'fee-contract',
    kind: 'task',
    responsible: 'bruno',
    title: 'Revisar contrato de honorários',
  },
  {
    completed: true,
    date: '2026-11-12',
    due: '12/11/2026',
    id: 'statements',
    kind: 'task',
    responsible: 'ana',
    title: 'Baixar extratos de 2024',
  },
]

const addTodoOptions = [
  { icon: FlagIcon, label: 'Novo prazo', value: 'deadline' },
  { icon: CalendarIcon, label: 'Nova audiência', value: 'hearing' },
  { icon: ListTodoIcon, label: 'Nova tarefa', value: 'task' },
] as const

const taskStatus = (task: ProcessTask, completed: boolean): TodoStatus => {
  if (completed) return 'done'
  return task.date < today ? 'overdue' : 'open'
}

export function TaskMenu({ task }: Readonly<{ task: TaskEntry }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${task.title}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenTask(task.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuItem onClick={() => onEditTask(task.id)}>
          <PencilIcon aria-hidden="true" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => onPostponeTask(task.id)}>
          <CalendarClockIcon aria-hidden="true" />
          Adiar
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={() => onDeleteTask(task.id)} variant="destructive">
          <Trash2Icon aria-hidden="true" />
          Excluir
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export function TaskItem({
  menu,
  onToggle,
  task,
}: Readonly<{
  menu?: ReactNode
  onToggle: (id: string) => void
  task: TaskEntry
}>) {
  return (
    <RecordGroupItem
      leading={
        <span className="flex size-6 items-center justify-center">
          <Checkbox
            aria-label={`Concluir ${task.title}`}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
          />
        </span>
      }
      title={
        <span
          className={
            task.completed ? 'text-muted-foreground line-through' : undefined
          }
          data-task-title=""
        >
          {task.title}
        </span>
      }
    >
      <span className="truncate text-muted-foreground">{task.due}</span>
      {menu}
    </RecordGroupItem>
  )
}

export function useCompleted(
  entries: readonly (TaskEntry | AgendaLinkEntry)[],
) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(
    Object.fromEntries(
      entries.flatMap((entry) =>
        entry.kind === 'task' ? [[entry.id, entry.completed]] : [],
      ),
    ),
  )
  const toggle = (id: string) =>
    setCompleted((current) => ({ ...current, [id]: !current[id] }))
  return { completed, toggle }
}

export function TasksGroup({
  title,
  variant,
  withMenu = false,
}: Readonly<{
  title: string
  variant: RecordGroupVariant
  withMenu?: boolean
}>) {
  const { completed, toggle } = useCompleted(tasks)

  return (
    <RecordGroup
      actions={<RecordGroupAction icon={PlusIcon} label="Adicionar tarefa" />}
      title={title}
      variant={variant}
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          menu={withMenu ? <TaskMenu task={task} /> : undefined}
          onToggle={toggle}
          task={{ ...task, completed: completed[task.id] ?? false }}
        />
      ))}
    </RecordGroup>
  )
}

export function AgendaGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const { completed, toggle } = useCompleted(agenda)
  const [kinds, setKinds] = useState<AgendaKind[]>(
    agendaKinds.map((kind) => kind.value),
  )
  const [sort, setSort] = useState<AgendaSort>('date-asc')
  const visible = sortAgenda(
    agenda.filter((entry) => kinds.includes(entry.kind)),
    sort,
  )

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            filterLabel="Tipo"
            filterOptions={agendaKinds}
            filterValue={kinds}
            label="Filtrar e ordenar a agenda"
            onFilterChange={(next) => setKinds(next as AgendaKind[])}
            onSortChange={(next) => setSort(next as AgendaSort)}
            sortLabel="Ordenar por"
            sortOptions={agendaSorts}
            sortValue={sort}
          />
          <RecordGroupAction icon={PlusIcon} label="Adicionar à agenda" />
        </>
      }
      empty={visible.length === 0}
      title={title}
      variant={variant}
    >
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum item com os tipos escolhidos
        </p>
      ) : null}
      {visible.map((entry) => {
        if (entry.kind === 'task')
          return (
            <TaskItem
              key={entry.id}
              onToggle={toggle}
              task={{ ...entry, completed: completed[entry.id] ?? false }}
            />
          )
        const { color, icon: Icon } = kindIcon[entry.kind]
        return (
          <RecordGroupLink
            href={entry.href}
            key={entry.id}
            leading={
              <IconFrame color={color} shape="rounded" size="xs">
                <Icon aria-hidden />
              </IconFrame>
            }
            meta={entry.meta}
          >
            {entry.title}
          </RecordGroupLink>
        )
      })}
    </RecordGroup>
  )
}

export function DeadlineMenu({ deadline }: Readonly<{ deadline: Deadline }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${deadline.label}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenDeadline(deadline.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        {deadline.status === 'open' ? (
          <MenuItem onClick={() => onFileDeadline(deadline.id)}>
            <FileCheckIcon aria-hidden="true" />
            Protocolar
          </MenuItem>
        ) : null}
        <MenuItem onClick={() => onShowCount(deadline.id)}>
          <SigmaIcon aria-hidden="true" />
          Ver contagem
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          onClick={() => onDeleteDeadline(deadline.id)}
          variant="destructive"
        >
          <Trash2Icon aria-hidden="true" />
          Excluir
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export function DeadlineItem({ deadline }: Readonly<{ deadline: Deadline }>) {
  const { color, label } = deadlineStatus[deadline.status]
  return (
    <RecordGroupItem
      interactive
      leading={
        <IconFrame color={deadlineColor} shape="rounded" size="xs">
          <FlagIcon aria-hidden />
        </IconFrame>
      }
      title={
        <a
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          data-deadline-title=""
          href={deadline.href}
        >
          {deadline.label}
        </a>
      }
    >
      <span className="truncate text-muted-foreground tabular-nums">
        {deadline.fatal}
      </span>
      <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
      <DeadlineMenu deadline={deadline} />
    </RecordGroupItem>
  )
}

export function ProcessEventLink({ event }: Readonly<{ event: ProcessEvent }>) {
  const { color, icon: Icon } = modalityFrame[event.modality]
  const status = processEventStatus[event.status]
  return (
    <RecordGroupLink
      href={event.href}
      leading={
        <IconFrame color={color} shape="rounded" size="xs">
          <Icon aria-hidden />
        </IconFrame>
      }
      meta={
        <span className="flex items-center gap-2">
          {event.time}
          <RecordStatusBadge color={status.color}>
            {status.label}
          </RecordStatusBadge>
        </span>
      }
    >
      {event.title}
    </RecordGroupLink>
  )
}

export function AddTodoMenu({ label }: Readonly<{ label: string }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {addTodoOptions.map(({ icon: Icon, label: option, value }) => (
          <MenuItem key={value} onClick={() => onAddTodo(value)}>
            <Icon aria-hidden="true" />
            {option}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

export function ProcessTodoGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const { completed, toggle } = useCompleted(processTasks)
  const [statuses, setStatuses] = useState<TodoStatus[]>(
    todoStatusOptions.map((option) => option.value),
  )
  const [people, setPeople] = useState<string[]>(
    responsibleOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<TodoSort>('date-asc')
  const keep = (status: TodoStatus, responsible: string) =>
    statuses.includes(status) && people.includes(responsible)
  const order = <T extends { date: string }>(list: readonly T[]) =>
    [...list].sort((a, b) =>
      sort === 'date-desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date),
    )
  const visibleDeadlines = order(
    deadlines.filter((deadline) =>
      keep(deadlineStatus[deadline.status].todo, deadline.responsible),
    ),
  )
  const visibleEvents = order(
    processEvents.filter((event) =>
      keep(processEventStatus[event.status].todo, event.responsible),
    ),
  )
  const visibleTasks = order(
    processTasks.filter((task) =>
      keep(taskStatus(task, completed[task.id] ?? false), task.responsible),
    ),
  )
  const children: { content: ReactNode; key: TodoSection; rows: number }[] = [
    {
      content: (
        <RecordGroupSubgroup
          count={visibleDeadlines.length}
          defaultOpen
          title="Prazos"
        >
          {visibleDeadlines.map((deadline) => (
            <DeadlineItem deadline={deadline} key={deadline.id} />
          ))}
        </RecordGroupSubgroup>
      ),
      key: 'deadlines' as const,
      rows: visibleDeadlines.length,
    },
    {
      content: (
        <RecordGroupSubgroup
          count={visibleEvents.length}
          title="Audiências e eventos"
        >
          {visibleEvents.map((event) => (
            <ProcessEventLink event={event} key={event.id} />
          ))}
        </RecordGroupSubgroup>
      ),
      key: 'events' as const,
      rows: visibleEvents.length,
    },
    {
      content: (
        <RecordGroupSubgroup count={visibleTasks.length} title="Tarefas">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              menu={<TaskMenu task={task} />}
              onToggle={toggle}
              task={{ ...task, completed: completed[task.id] ?? false }}
            />
          ))}
        </RecordGroupSubgroup>
      ),
      key: 'tasks' as const,
      rows: visibleTasks.length,
    },
  ].filter((child) => child.rows > 0)

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            label="Filtrar e ordenar prazos e tarefas"
            onSortChange={(next) => setSort(next as TodoSort)}
            sections={[
              {
                label: 'Status',
                onChange: (next) => setStatuses(next as TodoStatus[]),
                options: todoStatusOptions,
                value: statuses,
              },
              {
                label: 'Responsável',
                onChange: setPeople,
                options: responsibleOptions,
                value: people,
              },
            ]}
            sortLabel="Ordenar por"
            sortOptions={todoSorts}
            sortValue={sort}
          />
          <AddTodoMenu label="Adicionar a prazos e tarefas" />
        </>
      }
      empty={children.length === 0}
      title={title}
      variant={variant}
    >
      {children.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum item com os filtros escolhidos
        </p>
      ) : null}
      {children.map((child, index) => (
        <Fragment key={child.key}>
          {index > 0 ? <RecordGroupDivider /> : null}
          {child.content}
        </Fragment>
      ))}
    </RecordGroup>
  )
}
