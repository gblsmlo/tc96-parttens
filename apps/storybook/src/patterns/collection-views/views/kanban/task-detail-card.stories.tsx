import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardActionButton,
  KanbanCardBody,
  KanbanCardBodyRow,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardTitle,
  KanbanView,
} from '@tc96/parttens'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  Clock3Icon,
  EllipsisIcon,
  FileTextIcon,
  ListTodoIcon,
  MessageCircleIcon,
  UserRoundIcon,
} from 'lucide-react'
import { type ReactNode, useMemo } from 'react'
import {
  DueField,
  PriorityField,
  type UpdateTask,
} from '../../fixtures/task-fields'
import { moveTaskCard, useTasks } from '../../fixtures/task-renderers'
import { initialTasks, peopleById, type Task } from '../../fixtures/tasks'
import { projectTaskColumns } from './kanban-tasks'

function ActionSlot({
  children,
  createLabel,
  label,
  viewLabel,
}: Readonly<{
  children: ReactNode
  createLabel: string
  label: string
  viewLabel: string
}>) {
  return (
    <Menu>
      <MenuTrigger render={<KanbanCardActionButton aria-label={label} />}>
        {children}
      </MenuTrigger>
      <MenuPopup align="start">
        <MenuItem>{createLabel}</MenuItem>
        <MenuItem>{viewLabel}</MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function HeaderActions() {
  return (
    <Menu>
      <MenuTrigger
        render={
          <KanbanCardActionButton
            aria-label="Mais ações da tarefa"
            size="icon"
          />
        }
      >
        <EllipsisIcon aria-hidden className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem>Editar tarefa</MenuItem>
        <MenuItem>Duplicar tarefa</MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function TaskDetailCard({
  onChange,
  task,
}: Readonly<{ onChange: UpdateTask; task: Task }>) {
  const owner = peopleById.get(task.assigneeId)

  return (
    <KanbanCard density="sm">
      <KanbanCardHeader>
        <div className="flex min-w-0 items-center gap-2">
          <KanbanCardTitle className="min-w-0 flex-1 truncate">
            {task.title}
          </KanbanCardTitle>
        </div>
        <KanbanCardDescription>{task.description}</KanbanCardDescription>
        <KanbanCardAction>
          <HeaderActions />
        </KanbanCardAction>
      </KanbanCardHeader>

      <KanbanCardBody className="grid gap-2 text-sm">
        <KanbanCardBodyRow>
          <UserRoundIcon
            aria-hidden
            className="size-3.5 text-muted-foreground"
          />
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-muted text-[10px] text-foreground">
              {owner?.initials}
            </span>
            {owner?.name}
          </span>
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
          <PriorityField onChange={onChange} task={task} />
        </KanbanCardBodyRow>
      </KanbanCardBody>

      <KanbanCardFooter className="gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span data-kanban-card-action="">
            <ActionSlot
              createLabel="Criar nota"
              label="Notas: 1"
              viewLabel="Ver notas"
            >
              <FileTextIcon aria-hidden className="size-3.5" />
              <span>1</span>
            </ActionSlot>
          </span>
          <span data-kanban-card-action="">
            <ActionSlot
              createLabel="Criar subtarefa"
              label="Subtarefas: 1"
              viewLabel="Ver subtarefas"
            >
              <ListTodoIcon aria-hidden className="size-3.5" />
              <span>1</span>
            </ActionSlot>
          </span>
          <span data-kanban-card-action="">
            <ActionSlot
              createLabel="Criar comentário"
              label="Comentários: 1"
              viewLabel="Ver comentários"
            >
              <MessageCircleIcon aria-hidden className="size-3.5" />
              <span>1</span>
            </ActionSlot>
          </span>
        </div>
        <span className="ml-auto shrink-0" data-kanban-card-action="">
          <DueField onChange={onChange} task={task} variant="plain" />
        </span>
      </KanbanCardFooter>
    </KanbanCard>
  )
}

function TaskDetailBoard() {
  const { tasks, updateTask } = useTasks()
  const columns = useMemo(() => projectTaskColumns(tasks), [tasks])

  return (
    <div className="h-144 min-w-0 p-4">
      <KanbanView
        columns={columns}
        emptyColumnLabel="Nenhuma tarefa nesta coluna."
        getCardLabel={(task) => task.title}
        getKey={(task) => task.id}
        onMoveCard={moveTaskCard('status', updateTask)}
        renderCard={(task) => (
          <TaskDetailCard onChange={updateTask} task={task} />
        )}
      />
    </div>
  )
}

function TaskDetailCardExample() {
  const { tasks, updateTask } = useTasks(initialTasks.slice(0, 1))

  return <TaskDetailCard onChange={updateTask} task={tasks[0]} />
}

const meta = {
  component: TaskDetailCardExample,
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Usages/Detailed',
} satisfies Meta<typeof TaskDetailCardExample>

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {
  parameters: { layout: 'centered' },
}

export const Board: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <TaskDetailBoard />,
}
