import {
  EllipsisIcon,
  ListTodoIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from 'lucide-react'
import { useState } from 'react'
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
} from 'tc96/blocks'
import { SelectProperty, type SelectPropertyOption } from 'tc96/components'
import {
  Avatar,
  AvatarFallback,
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
  Popover,
  PopoverClose,
  PopoverPopup,
  PopoverTrigger,
} from 'tc96/ui'

const priorityOptions: readonly SelectPropertyOption[] = [
  { icon: SignalHighIcon, label: 'Alta', tone: 'danger', value: 'high' },
  { icon: SignalMediumIcon, label: 'Média', tone: 'warning', value: 'medium' },
  { icon: SignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
]

export interface TodoKanbanCardProps {
  title: string
  description: string
  taskCount?: number
  initialPriority?: string | null
  variant?: 'default' | 'interactive'
}

export function TodoKanbanCard({
  variant = 'default',
  ...contentProps
}: Readonly<TodoKanbanCardProps>) {
  return (
    <KanbanCard variant={variant}>
      <TodoKanbanCardContent {...contentProps} />
    </KanbanCard>
  )
}

function TodoKanbanCardContent({
  description,
  initialPriority = null,
  taskCount = 4,
  title,
}: Readonly<TodoKanbanCardProps>) {
  const [priority, setPriority] = useState<string | null>(initialPriority)

  const priorityProperty = (
    <SelectProperty
      ariaLabel="Prioridade"
      emptyOptionLabel="Sem prioridade"
      onValueChange={setPriority}
      options={priorityOptions}
      placeholder="Sem prioridade"
      value={priority}
    />
  )

  return (
    <>
      <KanbanCardHeader>
        <KanbanCardTitle>{title}</KanbanCardTitle>
        <KanbanCardDescription>{description}</KanbanCardDescription>
        <KanbanCardAction>
          <Menu>
            <MenuTrigger
              render={
                <KanbanCardActionButton
                  aria-label="Mais ações do card"
                  size="icon"
                />
              }
            >
              <EllipsisIcon aria-hidden className="size-4" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem>Editar card</MenuItem>
              <MenuItem>Duplicar card</MenuItem>
            </MenuPopup>
          </Menu>
        </KanbanCardAction>
      </KanbanCardHeader>

      <KanbanCardBody>
        <KanbanCardBodyRow data-kanban-card-action="">
          {priorityProperty}
        </KanbanCardBodyRow>
      </KanbanCardBody>

      <KanbanCardFooter>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <Popover>
            <PopoverTrigger
              render={
                <KanbanCardActionButton aria-label={`Tarefas: ${taskCount}`} />
              }
            >
              <ListTodoIcon aria-hidden className="size-3.5" />
              <span>{taskCount} tarefas</span>
            </PopoverTrigger>
            <PopoverPopup
              align="start"
              aria-label="Ações de tarefas"
              className="w-40"
            >
              <div className="flex flex-col gap-1">
                <PopoverClose
                  render={
                    <button
                      className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                      type="button"
                    />
                  }
                >
                  Criar tarefa
                </PopoverClose>
                <PopoverClose
                  render={
                    <button
                      className="rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                      type="button"
                    />
                  }
                >
                  Ver tarefas
                </PopoverClose>
              </div>
            </PopoverPopup>
          </Popover>
          <Avatar
            aria-label="Responsável: Ana Souza"
            className="size-6"
            title="Ana Souza"
          >
            <AvatarFallback className="text-xs text-foreground font-semibold">
              AS
            </AvatarFallback>
          </Avatar>
        </div>
      </KanbanCardFooter>
    </>
  )
}
