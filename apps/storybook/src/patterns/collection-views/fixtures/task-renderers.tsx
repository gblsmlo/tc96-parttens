import { Text } from '@tc96/elements/text'
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarItemRenderContext,
  KanbanCard,
  KanbanCardAction,
  KanbanCardBody,
  KanbanCardBodyRow,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardTitle,
  type ListItemDensity,
  ListRow,
} from '@tc96/parttens'
import {
  Clock3Icon,
  FileTextIcon,
  ListTodoIcon,
  MessageCircleIcon,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  KanbanCardCountAction,
  KanbanCardMoreActions,
} from './kanban-card-actions'
import {
  AssigneeField,
  DueField,
  PriorityField,
  StatusField,
  type UpdateTask,
} from './task-fields'
import {
  ANCHOR,
  formatMinutes,
  initialTasks,
  NOW,
  STATUS_TONE,
  statusOptions,
  type Task,
  TIME_ZONE,
  timeFormatter,
} from './tasks'

export function useTasks(initial: readonly Task[] = initialTasks) {
  const [tasks, setTasks] = useState<Task[]>([...initial])
  const updateTask = useCallback<UpdateTask>(
    (id, change) =>
      setTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, ...change } : task)),
      ),
    [],
  )

  return { setTasks, tasks, updateTask }
}

export const renderTaskListRow =
  (
    updateTask: UpdateTask,
    density: ListItemDensity = 'comfortable',
    onOpen: (task: Task) => void = () => undefined,
  ) =>
  (task: Task) => {
    const StatusIcon = statusOptions.find(
      (option) => option.value === task.status,
    )?.icon

    return (
      <ListRow
        density={density}
        description={[task.id, task.description]}
        icon={StatusIcon ? <StatusIcon /> : undefined}
        key={task.id}
        onClick={() => onOpen(task)}
        properties={
          <div className="flex items-center gap-2">
            <StatusField onChange={updateTask} task={task} />
            <PriorityField onChange={updateTask} task={task} />
            <DueField onChange={updateTask} task={task} />
            <AssigneeField display="avatar" onChange={updateTask} task={task} />
          </div>
        }
        title={task.title}
      />
    )
  }

export const renderTaskKanbanCard =
  (updateTask: UpdateTask) => (task: Task) => {
    return (
      <KanbanCard density="sm" key={task.id} variant="interactive">
        <KanbanCardHeader>
          <div className="flex min-w-0 items-center gap-2">
            <KanbanCardTitle className="min-w-0 flex-1 truncate">
              {task.title}
            </KanbanCardTitle>
          </div>
          <KanbanCardDescription>{task.description}</KanbanCardDescription>
          <KanbanCardAction>
            <KanbanCardMoreActions
              items={['Editar tarefa', 'Duplicar tarefa']}
              label="Mais ações da tarefa"
            />
          </KanbanCardAction>
        </KanbanCardHeader>

        <KanbanCardBody className="grid gap-2 text-sm">
          <KanbanCardBodyRow data-kanban-card-action="">
            <DueField onChange={updateTask} task={task} variant="plain" />
          </KanbanCardBodyRow>
          <KanbanCardBodyRow>
            <Text
              className="flex min-w-0 items-center gap-2"
              foreground="muted"
              size="sm"
            >
              <Clock3Icon aria-hidden className="size-3.5" />
              <span>{task.estimate} h</span>
            </Text>
          </KanbanCardBodyRow>
          <KanbanCardBodyRow data-kanban-card-action="">
            <PriorityField onChange={updateTask} task={task} />
          </KanbanCardBodyRow>
        </KanbanCardBody>

        <KanbanCardFooter className="gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span data-kanban-card-action="">
              <KanbanCardCountAction
                createLabel="Criar nota"
                label="Notas: 1"
                viewLabel="Ver notas"
              >
                <FileTextIcon aria-hidden className="size-3.5" />
                <span>1</span>
              </KanbanCardCountAction>
            </span>
            <span data-kanban-card-action="">
              <KanbanCardCountAction
                createLabel="Criar subtarefa"
                label="Subtarefas: 1"
                viewLabel="Ver subtarefas"
              >
                <ListTodoIcon aria-hidden className="size-3.5" />
                <span>1</span>
              </KanbanCardCountAction>
            </span>
            <span data-kanban-card-action="">
              <KanbanCardCountAction
                createLabel="Criar comentário"
                label="Comentários: 1"
                viewLabel="Ver comentários"
              >
                <MessageCircleIcon aria-hidden className="size-3.5" />
                <span>1</span>
              </KanbanCardCountAction>
            </span>
          </div>
          <span className="ml-auto shrink-0" data-kanban-card-action="">
            <AssigneeField
              display="avatar"
              onChange={updateTask}
              task={task}
              variant="plain"
            />
          </span>
        </KanbanCardFooter>
      </KanbanCard>
    )
  }

export const createTaskCalendarProps = (updateTask: UpdateTask) => ({
  anchor: ANCHOR,
  getItemSchedule: (task: Task) => ({
    end: task.end ? new Date(task.end) : null,
    isAllDay: task.isAllDay ?? false,
    start: new Date(task.start),
  }),
  loadingItemLabel: 'Carregando tarefa',
  now: NOW,
  onItemReschedule: ({
    end,
    isAllDay,
    item,
    start,
  }: {
    end: Date | null
    isAllDay: boolean
    item: Task
    start: Date
  }) => {
    updateTask(item.id, {
      end: end?.toISOString() ?? null,
      isAllDay,
      start: start.toISOString(),
    })
    return true
  },
  renderItem: (task: Task, context: CalendarItemRenderContext) => {
    const inTimeGrid = context.placement === 'time-grid'
    return (
      <CalendarEventChip
        completed={task.status === 'done'}
        display={inTimeGrid ? 'block' : 'chip'}
        tone={
          task.priority === 'urgent' && task.status !== 'done'
            ? 'destructive'
            : STATUS_TONE[task.status]
        }
      >
        {inTimeGrid ? (
          <CalendarEventChipTime>
            {formatMinutes(context.startMinutes)}
          </CalendarEventChipTime>
        ) : task.isAllDay ? null : (
          <CalendarEventChipTime>
            {timeFormatter.format(new Date(task.start))}
          </CalendarEventChipTime>
        )}
        <CalendarEventChipTitle>{task.title}</CalendarEventChipTitle>
        <CalendarEventChipOpenTrigger aria-label={`Abrir ${task.title}`} />
      </CalendarEventChip>
    )
  },
  timeZone: TIME_ZONE,
  weekStartsOn: 1 as const,
})
