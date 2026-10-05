import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarItemRenderContext,
  type CollectionGroupingId,
  KanbanCard,
  KanbanCardBody,
  KanbanCardBodyRow,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  type KanbanCardMove,
  KanbanCardTitle,
  type ListItemDensity,
  ListRow,
} from '@tc96/parttens'
import { useCallback, useState } from 'react'
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
  groupings,
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

  const replaceTask = useCallback((next: Task) => {
    setTasks((current) =>
      current.map((task) => (task.id === next.id ? next : task)),
    )
    return true
  }, [])

  return { replaceTask, setTasks, tasks, updateTask }
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
  (groupBy: CollectionGroupingId | null, updateTask: UpdateTask) =>
  (task: Task) => (
    <KanbanCard key={task.id} variant="interactive">
      <KanbanCardHeader>
        <KanbanCardTitle>{task.title}</KanbanCardTitle>
        <KanbanCardDescription>{task.description}</KanbanCardDescription>
      </KanbanCardHeader>
      <KanbanCardBody>
        <KanbanCardBodyRow data-kanban-card-action="">
          {groupBy === 'status' ? (
            <PriorityField onChange={updateTask} task={task} />
          ) : (
            <StatusField onChange={updateTask} task={task} />
          )}
        </KanbanCardBodyRow>
      </KanbanCardBody>
      <KanbanCardFooter>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 text-muted-foreground text-xs">
          <DueField onChange={updateTask} task={task} variant="plain" />
          <AssigneeField
            display="avatar"
            onChange={updateTask}
            task={task}
            variant="plain"
          />
        </div>
      </KanbanCardFooter>
    </KanbanCard>
  )

const statusGrouping = groupings.find(({ id }) => id === 'status')

export const moveTaskStatus =
  (replaceTask: (task: Task) => boolean) =>
  ({ card, targetColumnId }: KanbanCardMove<Task>) =>
    statusGrouping?.setGroupId
      ? replaceTask(statusGrouping.setGroupId(card, targetColumnId))
      : false

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
