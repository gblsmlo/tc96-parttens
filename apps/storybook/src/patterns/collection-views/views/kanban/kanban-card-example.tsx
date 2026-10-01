import {
  ListTodoIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import {
  KanbanCardContent,
  KanbanCardDescription,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardTitle,
} from 'tc96/blocks'
import { SelectProperty, type SelectPropertyOption } from 'tc96/components'
import { Avatar, AvatarFallback } from 'tc96/ui'

const priorityOptions: readonly SelectPropertyOption[] = [
  { icon: SignalHighIcon, label: 'Alta', tone: 'danger', value: 'high' },
  { icon: SignalMediumIcon, label: 'Média', tone: 'warning', value: 'medium' },
  { icon: SignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
]

export interface KanbanCardExampleContentProps {
  title: string
  description: string
  taskCount?: number
  initialPriority?: string | null
  readOnlyPriority?: boolean
  priorityIsCardAction?: boolean
  footerExtra?: ReactNode
  onPriorityChange?: (value: string | null) => void
}

export function KanbanCardExampleContent({
  description,
  footerExtra,
  initialPriority = null,
  onPriorityChange,
  priorityIsCardAction = false,
  readOnlyPriority = false,
  taskCount = 4,
  title,
}: Readonly<KanbanCardExampleContentProps>) {
  const [priority, setPriority] = useState<string | null>(initialPriority)

  const priorityProperty = (
    <SelectProperty
      ariaLabel="Prioridade"
      emptyOptionLabel="Sem prioridade"
      onValueChange={(next) => {
        setPriority(next)
        onPriorityChange?.(next)
      }}
      options={priorityOptions}
      placeholder="Sem prioridade"
      readOnly={readOnlyPriority}
      value={priority}
    />
  )

  return (
    <>
      <KanbanCardHeader>
        <KanbanCardTitle>{title}</KanbanCardTitle>
        <KanbanCardDescription>{description}</KanbanCardDescription>
      </KanbanCardHeader>

      <KanbanCardContent>
        {priorityIsCardAction ? (
          <div data-kanban-card-action="">{priorityProperty}</div>
        ) : (
          priorityProperty
        )}
      </KanbanCardContent>

      <KanbanCardFooter>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <ListTodoIcon aria-hidden className="size-3.5" />
            <span>{taskCount} tarefas</span>
          </span>
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
        {footerExtra}
      </KanbanCardFooter>
    </>
  )
}
