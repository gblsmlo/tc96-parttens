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
  KanbanCardOpenTrigger,
  KanbanCardTitle,
} from '@tc96/parttens'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  Popover,
  PopoverClose,
  PopoverPopup,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { EllipsisIcon, ListTodoIcon, MessageCircleIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  AssigneeField,
  DueField,
  PriorityField,
} from '../../fixtures/task-fields'
import { useTasks } from '../../fixtures/task-renderers'
import { initialTasks } from '../../fixtures/tasks'

const meta = {
  component: KanbanCard,
  parameters: {
    docs: {
      description: {
        component:
          'Estrutura e estados do card de Kanban com conteúdo neutro para dar contexto aos slots. Composições específicas de Todo e Sales estão em Usages.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Cards',
} satisfies Meta<typeof KanbanCard>

export default meta
type Story = StoryObj<typeof meta>

function CardActions() {
  return (
    <Menu>
      <MenuTrigger
        render={
          <KanbanCardActionButton aria-label="Mais ações do card" size="icon" />
        }
      >
        <EllipsisIcon aria-hidden className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem>Editar card</MenuItem>
        <MenuItem>Duplicar card</MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function FooterAction({
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
    <Popover>
      <PopoverTrigger render={<KanbanCardActionButton aria-label={label} />}>
        {children}
      </PopoverTrigger>
      <PopoverPopup align="start" aria-label={label} className="w-44">
        <div className="flex flex-col gap-1">
          {[createLabel, viewLabel].map((item) => (
            <PopoverClose
              key={item}
              render={
                <button
                  className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                  type="button"
                />
              }
            >
              {item}
            </PopoverClose>
          ))}
        </div>
      </PopoverPopup>
    </Popover>
  )
}

function ContextCard({
  dimmed = false,
  display = 'full',
  interactive = false,
  selected = false,
}: Readonly<{
  dimmed?: boolean
  display?: 'full' | 'compact'
  interactive?: boolean
  selected?: boolean
}>) {
  const { tasks, updateTask } = useTasks(initialTasks.slice(0, 1))
  const task = tasks[0]

  return (
    <div className="w-80 p-4">
      <KanbanCard
        dimmed={dimmed}
        display={display}
        selected={selected}
        variant={interactive ? 'interactive' : 'default'}
      >
        {interactive && <KanbanCardOpenTrigger aria-label="Abrir card" />}
        <KanbanCardHeader>
          <KanbanCardTitle>
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{task.title}</span>
              {display === 'compact' && (
                <AssigneeField
                  display="avatar"
                  onChange={updateTask}
                  task={task}
                  variant="plain"
                />
              )}
            </span>
          </KanbanCardTitle>
          <KanbanCardDescription>{task.description}</KanbanCardDescription>
          <KanbanCardAction>
            <CardActions />
          </KanbanCardAction>
        </KanbanCardHeader>
        <KanbanCardBody className="grid gap-2">
          <KanbanCardBodyRow align="start" data-kanban-card-action="">
            <Text foreground="muted" size="sm">
              Prioridade
            </Text>
            <PriorityField onChange={updateTask} task={task} />
          </KanbanCardBodyRow>
          <KanbanCardBodyRow align="start" data-kanban-card-action="">
            <Text foreground="muted" size="sm">
              Prazo
            </Text>
            <DueField onChange={updateTask} task={task} variant="plain" />
          </KanbanCardBodyRow>
        </KanbanCardBody>
        <KanbanCardFooter>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <FooterAction
              createLabel="Criar tarefa"
              label="Tarefas: 3"
              viewLabel="Ver tarefas"
            >
              <ListTodoIcon aria-hidden className="size-3.5" />
              <span>3</span>
            </FooterAction>
            <FooterAction
              createLabel="Criar comentário"
              label="Comentários: 2"
              viewLabel="Ver comentários"
            >
              <MessageCircleIcon aria-hidden className="size-3.5" />
              <span>2</span>
            </FooterAction>
            <span className="ml-auto">
              <AssigneeField
                display="avatar"
                onChange={updateTask}
                task={task}
                variant="plain"
              />
            </span>
          </div>
        </KanbanCardFooter>
      </KanbanCard>
    </div>
  )
}

const renderCard: Story['render'] = (args) => (
  <ContextCard
    dimmed={args.dimmed}
    display={args.display}
    interactive={args.variant === 'interactive'}
    selected={args.selected}
  />
)

export const Default: Story = { render: renderCard }
export const Compact: Story = {
  args: { display: 'compact' },
  render: renderCard,
}
export const Selected: Story = {
  args: { selected: true },
  render: renderCard,
}
export const Moving: Story = {
  args: { dimmed: true },
  render: renderCard,
}
export const Interactive: Story = {
  args: { variant: 'interactive' },
  render: renderCard,
}
