import { Text } from '@tc96/elements/text'
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  type CalendarRecordRenderContext,
  KanbanCard,
  type ListItemDensity,
  ListRow,
} from '@tc96/parttens'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import {
  CalendarIcon,
  CircleDotIcon,
  Clock3Icon,
  FileTextIcon,
  ListTodoIcon,
  MessageCircleIcon,
  SignalIcon,
} from 'lucide-react'
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
      <KanbanCard
        assignee={
          <AssigneeField
            avatarSize="sm"
            display="avatar"
            onChange={updateTask}
            task={task}
            variant="plain"
          />
        }
        counts={[
          {
            count: 1,
            icon: <FileTextIcon aria-hidden />,
            id: 'notes',
            items: [{ label: 'Criar nota' }, { label: 'Ver notas' }],
            label: 'Notas: 1',
          },
          {
            count: 1,
            icon: <ListTodoIcon aria-hidden />,
            id: 'subtasks',
            items: [{ label: 'Criar subtarefa' }, { label: 'Ver subtarefas' }],
            label: 'Subtarefas: 1',
          },
          {
            count: 1,
            icon: <MessageCircleIcon aria-hidden />,
            id: 'comments',
            items: [
              { label: 'Criar comentário' },
              { label: 'Ver comentários' },
            ],
            label: 'Comentários: 1',
          },
        ]}
        density="sm"
        description={task.description}
        fields={[
          {
            content: (
              <StatusField onChange={updateTask} task={task} variant="plain" />
            ),
            icon: <CircleDotIcon aria-hidden />,
            id: 'status',
            label: 'Status',
            interactive: true,
          },
          {
            content: (
              <DueField onChange={updateTask} task={task} variant="plain" />
            ),
            icon: <CalendarIcon aria-hidden />,
            id: 'due',
            label: 'Prazo',
            interactive: true,
          },
          {
            content: `${task.estimate} h`,
            icon: <Clock3Icon aria-hidden />,
            id: 'estimate',
            label: 'Estimativa',
          },
          {
            content: (
              <PriorityField
                onChange={updateTask}
                task={task}
                variant="plain"
              />
            ),
            icon: <SignalIcon aria-hidden />,
            id: 'priority',
            label: 'Prioridade',
            interactive: true,
          },
        ]}
        key={task.id}
        menu={{
          items: [{ label: 'Editar tarefa' }, { label: 'Duplicar tarefa' }],
          label: 'Mais ações da tarefa',
        }}
        title={task.title}
        variant="interactive"
      />
    )
  }

export const renderTaskGalleryCard =
  (updateTask: UpdateTask) => (task: Task) => (
    <Card className="h-full min-h-44" render={<article />}>
      <CardHeader>
        <Text className="font-mono" size="xs">
          {task.id}
        </Text>
        <CardTitle render={<h2>{task.title}</h2>} />
        <CardDescription render={<p>{task.description}</p>} />
      </CardHeader>
      <CardFooter className="mt-auto flex-wrap gap-2">
        <StatusField onChange={updateTask} task={task} />
        <PriorityField onChange={updateTask} task={task} />
        <AssigneeField display="avatar" onChange={updateTask} task={task} />
      </CardFooter>
    </Card>
  )

export const createTaskCalendarProps = (updateTask: UpdateTask) => ({
  anchor: ANCHOR,
  getRecordSchedule: (task: Task) => ({
    end: task.end ? new Date(task.end) : null,
    isAllDay: task.isAllDay ?? false,
    start: new Date(task.start),
  }),
  loadingRecordLabel: 'Carregando tarefa',
  now: NOW,
  onRecordReschedule: ({
    end,
    isAllDay,
    record,
    start,
  }: {
    end: Date | null
    isAllDay: boolean
    record: Task
    start: Date
  }) => {
    updateTask(record.id, {
      end: end?.toISOString() ?? null,
      isAllDay,
      start: start.toISOString(),
    })
    return true
  },
  renderRecord: (task: Task, context: CalendarRecordRenderContext) => {
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
