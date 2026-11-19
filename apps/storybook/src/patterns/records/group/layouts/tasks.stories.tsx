import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
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
import { type ComponentType, Fragment, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface TasksArgs {
  variant: RecordGroupVariant
}

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

const hidden = { table: { disable: true } } as const
const onOpenTask = fn()
const onEditTask = fn()
const onPostponeTask = fn()
const onDeleteTask = fn()

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

const onOpenDeadline = fn()
const onFileDeadline = fn()
const onShowCount = fn()
const onDeleteDeadline = fn()
const onAddTodo = fn()

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

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import { RecordGroup, RecordGroupAction, RecordGroupItem, RecordGroupLink } from '@acme/patterns'
import { Checkbox } from '@acme/ui/checkbox'

<RecordGroup
  actions={<RecordGroupAction icon={PlusIcon} label="Add task" onClick={addTask} />}
  title="Tasks"
>
  <RecordGroupItem
    leading={
      <span className="flex size-6 items-center justify-center">
        <Checkbox aria-label={\`Complete \${task.title}\`} checked={task.completed} onCheckedChange={toggle} />
      </span>
    }
    title={task.title}
  >
    <span className="truncate text-muted-foreground">{task.due}</span>
  </RecordGroupItem>
  <RecordGroupLink
    href={event.url}
    leading={
      <IconFrame color={event.color} shape="rounded" size="xs">
        <CalendarIcon aria-hidden="true" />
      </IconFrame>
    }
    meta={event.meta}
  >
    {event.title}
  </RecordGroupLink>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'A task is a `RecordGroupItem`: `leading` holds the COSS `Checkbox` in a 24px box, named by the task (`leading` sizes only a direct `svg` child, so the check mark keeps its own size), the title is the task name, struck through when completed, and `children` holds the due date as muted text and, in `With Menu`, the three-dots menu.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'A deadline or a calendar event is a `RecordGroupLink` that opens it: a colored `IconFrame` (`xs`, 24px) in `leading`, the title as content and the date or the time in `meta`; the icon, not the copy, tells a deadline from an event. The 24px box of the checkbox and of the frame keeps every name on one column.',
      name: 'RecordGroupLink',
    },
  ],
  description: {
    component:
      'The tasks and dates of a record in a `RecordGroup`. `Tasks` lists only tasks, each with a checkbox and its due date. `With Menu` adds a three-dots button after the due date of each task, opening the task actions. `Agenda` mixes tasks, deadlines and calendar events, by the nearest date first; a `RecordGroupFilter` in `actions` filters by kind and sorts by date or kind, and the consumer applies both to the rows it passes: tasks keep the checkbox, deadlines and events are links with a colored icon, and the checkbox or the icon tells the kind, so the right side holds only the date. `Behavior` is under test: completing a task strikes its name, a long task name truncates while its date stays whole, links are named by their title and `meta`, the task menu opens its actions, the agenda filter hides a kind and reorders the rows, and the names of tasks and links start on one column. `Grouped` is one `Prazos e tarefas` group of a lawsuit, modeled on the Lemind Processo: `Prazos` (each deadline with its fatal date and status, a flag frame in one fixed color for the kind, and a menu), `Audiências e eventos` (as in `Layouts/Events`) and `Tarefas` (as in `With Menu`), each a `RecordGroupSubgroup` with its `count`, split by `RecordGroupDivider`. The header holds a `RecordGroupFilter` with two `sections`, Status and Responsável, and a sort by date, then one `+` whose menu creates a deadline, a hearing or a task; the subgroups have no actions. The story applies the filter and the sort, hides a subgroup the filter empties together with its divider, and passes `empty` when nothing is left. In `Behavior`, the grouped part checks the headings and counts, the dividers, the single `+` and its menu, the deadline menu, the sort, the filter hiding a status and then whole subgroups, and that every row fits its panel.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function TaskMenu({ task }: Readonly<{ task: TaskEntry }>) {
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

function TaskItem({
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

function useCompleted(entries: readonly (TaskEntry | AgendaLinkEntry)[]) {
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

function TasksGroup({
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

function AgendaGroup({
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

function DeadlineMenu({ deadline }: Readonly<{ deadline: Deadline }>) {
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

function DeadlineItem({ deadline }: Readonly<{ deadline: Deadline }>) {
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

function ProcessEventLink({ event }: Readonly<{ event: ProcessEvent }>) {
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

function AddTodoMenu({ label }: Readonly<{ label: string }>) {
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

function ProcessTodoGroup({
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

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupItem as unknown as ComponentType<TasksArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Tasks',
} satisfies Meta<TasksArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Tasks: Story = {
  render: ({ variant }) => <TasksGroup title="Tarefas" variant={variant} />,
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <TasksGroup title="Tarefas" variant={variant} withMenu />
  ),
}

export const Agenda: Story = {
  render: ({ variant }) => <AgendaGroup title="Agenda" variant={variant} />,
}

export const Grouped: Story = {
  render: ({ variant }) => (
    <ProcessTodoGroup title="Prazos e tarefas" variant={variant} />
  ),
}

const rgbOf = (hex: string) =>
  `rgb(${[1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)).join(', ')})`

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"], [data-slot="record-group-link"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    const panel = row.closest('[data-slot="collapsible-panel"]') as HTMLElement
    await expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(
      panel.getBoundingClientRect().right + 0.5,
    )
  }
}

const nameLeft = (row: HTMLElement) =>
  (
    row.querySelector(
      '[data-task-title], [data-slot="record-group-link-name"]',
    ) as HTMLElement
  ).getBoundingClientRect().left

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tasksRegion = canvas.getByRole('region', { name: 'Tarefas' })
    const agendaRegion = canvas.getByRole('region', { name: 'Agenda' })
    const taskList = within(tasksRegion)

    const items = tasksRegion.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item"]',
    )
    await expect(items).toHaveLength(tasks.length)
    for (const item of items) {
      await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
    }
    const longName = (items[2] as HTMLElement).querySelector(
      '[data-slot="record-group-item-title"]',
    ) as HTMLElement
    const longDue = within(items[2] as HTMLElement).getByText('24/11/2026')
    await expect(longName.scrollWidth).toBeGreaterThan(longName.clientWidth)
    await expect(longDue.scrollWidth).toBeLessThanOrEqual(longDue.clientWidth)

    const done = taskList.getByRole('checkbox', {
      name: 'Concluir Baixar extratos de 2024',
    })
    await expect(done).toBeChecked()
    const first = taskList.getByRole('checkbox', {
      name: 'Concluir Enviar procuração ao cliente',
    })
    await expect(first).not.toBeChecked()
    await userEvent.click(first)
    await expect(first).toBeChecked()
    await expect(
      taskList.getByText('Enviar procuração ao cliente'),
    ).toHaveClass('line-through')

    const links = within(agendaRegion).getAllByRole('link')
    const linkEntries = agenda.filter(
      (entry): entry is AgendaLinkEntry & { date: string } =>
        entry.kind !== 'task',
    )
    await expect(links).toHaveLength(linkEntries.length)
    for (const [index, entry] of linkEntries.entries()) {
      await expect(links[index]).toHaveAccessibleName(
        `${entry.title} ${entry.meta}`,
      )
      await expect(links[index]).toHaveAttribute('href', entry.href)
    }
    await expect(
      within(agendaRegion).getAllByRole('checkbox', { name: /^Concluir / }),
    ).toHaveLength(agenda.length - linkEntries.length)

    const menuRegion = canvas.getByRole('region', { name: 'Tarefas com menu' })
    const menuItems = menuRegion.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item"]',
    )
    await expect(menuItems).toHaveLength(tasks.length)
    for (const item of menuItems) {
      await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
      const [due, button] = [
        ...(
          item.querySelector(
            '[data-slot="record-group-item-trailing"]',
          ) as HTMLElement
        ).children,
      ] as HTMLElement[]
      await expect(
        (button as HTMLElement).getBoundingClientRect().left -
          (due as HTMLElement).getBoundingClientRect().right,
      ).toBeCloseTo(4, 0)
    }
    const firstTask = tasks[0] as TaskEntry
    onEditTask.mockClear()
    await userEvent.click(
      within(menuRegion).getByRole('button', {
        name: `Ações de ${firstTask.title}`,
      }),
    )
    await expect(
      (await screen.findAllByRole('menuitem')).map((item) => item.textContent),
    ).toEqual(['Abrir', 'Editar', 'Adiar', 'Excluir'])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }))
    await expect(onEditTask).toHaveBeenCalledWith(firstTask.id)

    const rows = [
      ...agendaRegion.querySelectorAll<HTMLElement>(
        '[data-slot="record-group-item"], [data-slot="record-group-link"]',
      ),
    ]
    const lefts = rows.map(nameLeft)
    for (const left of lefts) {
      await expect(left).toBeCloseTo(lefts[0] as number, 0)
    }

    const agendaGroup = within(agendaRegion)
    const titlesIn = () =>
      [
        ...agendaRegion.querySelectorAll(
          '[data-task-title], [data-slot="record-group-link-name"]',
        ),
      ].map((node) => node.textContent)
    await expect(titlesIn()).toEqual([
      'Revisar contrato de honorários',
      'Protocolar petição inicial',
      'Prazo da contestação',
      'Audiência de conciliação',
      'Reunião com o cliente',
    ])

    await userEvent.click(
      agendaGroup.getByRole('button', { name: 'Filtrar e ordenar a agenda' }),
    )
    const dialog = within(await screen.findByRole('dialog'))
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Tarefas' }))
    await expect(
      agendaGroup.queryAllByRole('checkbox', { name: /^Concluir / }),
    ).toHaveLength(0)
    await userEvent.click(
      dialog.getByRole('radio', { name: 'Data mais distante' }),
    )
    await expect(titlesIn()).toEqual([
      'Reunião com o cliente',
      'Audiência de conciliação',
      'Prazo da contestação',
    ])

    await userEvent.click(dialog.getByRole('checkbox', { name: 'Tarefas' }))
    await userEvent.click(dialog.getByRole('radio', { name: 'Tipo' }))
    await expect(titlesIn()).toEqual([
      'Revisar contrato de honorários',
      'Protocolar petição inicial',
      'Prazo da contestação',
      'Audiência de conciliação',
      'Reunião com o cliente',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      agendaGroup.getByRole('button', { name: 'Filtrar e ordenar a agenda' }),
    ).toHaveFocus()

    const todoRegion = canvas.getByRole('region', { name: 'Prazos e tarefas' })
    const todo = within(todoRegion)
    const headings = () =>
      todo.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    await expect(headings()).toEqual([
      `Prazos${deadlines.length}`,
      `Audiências e eventos${processEvents.length}`,
      `Tarefas${processTasks.length}`,
    ])
    await expect(todo.getAllByRole('separator')).toHaveLength(2)
    const header = todoRegion.querySelector(
      '[data-slot="record-group-header"]',
    ) as HTMLElement
    const headerMenus = within(header)
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-haspopup') === 'menu')
    await expect(headerMenus).toHaveLength(1)
    await expect(headerMenus[0]).toHaveAccessibleName(
      'Adicionar a prazos e tarefas',
    )
    for (const subgroup of todoRegion.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-subgroup"] h3',
    )) {
      await expect(within(subgroup).getAllByRole('button')).toHaveLength(1)
    }

    const deadlineTitles = () =>
      [...todoRegion.querySelectorAll('[data-deadline-title]')].map(
        (node) => node.textContent,
      )
    await expect(deadlineTitles()).toEqual([
      'Réplica',
      'Manifestação sobre o laudo pericial',
      'Contestação',
    ])
    for (const deadline of deadlines) {
      const link = todo.getByRole('link', { name: deadline.label })
      await expect(link).toHaveAttribute('href', deadline.href)
      const row = link.closest('[data-slot="record-group-item"]') as HTMLElement
      const frame = row.querySelector('[data-slot="icon-frame"]') as HTMLElement
      await expect(getComputedStyle(frame).color).toBe(rgbOf(deadlineColor))
      const status = deadlineStatus[deadline.status]
      const badge = within(row).getByText(status.label)
      await expect(badge.closest('[style]')?.getAttribute('style')).toContain(
        status.color,
      )
      await expect(within(row).getByText(deadline.fatal)).toBeVisible()
    }

    onFileDeadline.mockClear()
    await userEvent.click(
      todo.getByRole('button', { name: 'Ações de Contestação' }),
    )
    const openMenu = await screen.findByRole('menu')
    await waitFor(() => expect(openMenu).toBeVisible())
    await expect(
      within(openMenu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['Abrir', 'Protocolar', 'Ver contagem', 'Excluir'])
    await userEvent.click(
      within(openMenu).getByRole('menuitem', { name: 'Protocolar' }),
    )
    await expect(onFileDeadline).toHaveBeenCalledWith('answer')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await userEvent.click(
      todo.getByRole('button', { name: 'Ações de Réplica' }),
    )
    const filedMenu = await screen.findByRole('menu')
    await waitFor(() => expect(filedMenu).toBeVisible())
    await expect(
      within(filedMenu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(['Abrir', 'Ver contagem', 'Excluir'])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    onAddTodo.mockClear()
    await userEvent.click(headerMenus[0] as HTMLElement)
    const addMenu = await screen.findByRole('menu')
    await waitFor(() => expect(addMenu).toBeVisible())
    await expect(
      within(addMenu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(addTodoOptions.map((option) => option.label))
    await userEvent.click(
      within(addMenu).getByRole('menuitem', { name: 'Nova audiência' }),
    )
    await expect(onAddTodo).toHaveBeenCalledWith('hearing')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    await userEvent.click(
      todo.getByRole('button', {
        name: `Audiências e eventos ${processEvents.length}`,
      }),
    )
    await userEvent.click(
      todo.getByRole('button', { name: `Tarefas ${processTasks.length}` }),
    )
    const firstEvent = processEvents[0] as ProcessEvent
    await expect(
      await todo.findByRole('link', {
        name: `${firstEvent.title} ${firstEvent.time} Hoje`,
      }),
    ).toHaveAttribute('href', firstEvent.href)
    await expect(
      await todo.findByRole('checkbox', {
        name: 'Concluir Baixar extratos de 2024',
      }),
    ).toBeChecked()
    await rowsFit(todoRegion)

    await userEvent.click(
      todo.getByRole('button', { name: 'Filtrar e ordenar prazos e tarefas' }),
    )
    const filterElement = await screen.findByRole('dialog')
    await waitFor(() => expect(filterElement).toBeVisible())
    const filter = within(filterElement)
    await userEvent.click(
      filter.getByRole('radio', { name: 'Data mais distante' }),
    )
    await expect(deadlineTitles()).toEqual([
      'Contestação',
      'Manifestação sobre o laudo pericial',
      'Réplica',
    ])
    const statusSection = within(filter.getByRole('group', { name: 'Status' }))
    await userEvent.click(
      statusSection.getByRole('checkbox', { name: 'Concluído' }),
    )
    await expect(headings()).toEqual([
      'Prazos2',
      'Audiências e eventos2',
      'Tarefas2',
    ])
    await expect(todo.queryByText('Réplica')).toBeNull()
    await userEvent.click(
      statusSection.getByRole('checkbox', { name: 'Em aberto' }),
    )
    await expect(headings()).toEqual(['Prazos1', 'Tarefas1'])
    await expect(todo.getAllByRole('separator')).toHaveLength(1)
    const people = within(filter.getByRole('group', { name: 'Responsável' }))
    await userEvent.click(
      people.getByRole('checkbox', { name: 'Bruno Tavares' }),
    )
    await expect(headings()).toEqual(['Tarefas1'])
    await expect(todo.queryAllByRole('separator')).toHaveLength(0)
    await userEvent.click(people.getByRole('checkbox', { name: 'Ana Ribeiro' }))
    await expect(headings()).toEqual([])
    await expect(todoRegion).toHaveAttribute('data-empty', 'true')
    await expect(
      todo.getByText('Nenhum item com os filtros escolhidos'),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <TasksGroup title="Tarefas" variant="plain" />
      <AgendaGroup title="Agenda" variant="plain" />
      <TasksGroup title="Tarefas com menu" variant="plain" withMenu />
      <ProcessTodoGroup title="Prazos e tarefas" variant="plain" />
    </div>
  ),
}
