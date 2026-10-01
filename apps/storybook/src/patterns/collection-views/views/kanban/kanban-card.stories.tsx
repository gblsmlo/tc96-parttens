import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
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
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  Popover,
  PopoverClose,
  PopoverPopup,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { Text } from '@tc96/ui/text'
import { EllipsisIcon, ListTodoIcon, MessageCircleIcon } from 'lucide-react'
import { type ReactNode, useState } from 'react'

const priorityOptions: readonly SelectPropertyOption[] = [
  { label: 'Alta', tone: 'danger', value: 'high' },
  { label: 'Média', tone: 'warning', value: 'medium' },
  { label: 'Baixa', tone: 'neutral', value: 'low' },
]

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

function CardOwner() {
  return (
    <Avatar
      aria-label="Responsável: Ana Souza"
      className="size-6"
      title="Ana Souza"
    >
      <AvatarFallback className="text-xs font-semibold text-foreground">
        AS
      </AvatarFallback>
    </Avatar>
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
  const [priority, setPriority] = useState<string | null>('medium')

  return (
    <div className="w-80 max-w-full p-4">
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
              <span className="truncate">Revisar proposta comercial</span>
              {display === 'compact' && <CardOwner />}
            </span>
          </KanbanCardTitle>
          <KanbanCardDescription>
            Validar valores e condições antes do envio ao cliente.
          </KanbanCardDescription>
          <KanbanCardAction>
            <CardActions />
          </KanbanCardAction>
        </KanbanCardHeader>
        <KanbanCardBody className="grid gap-2">
          <KanbanCardBodyRow align="start" data-kanban-card-action="">
            <Text foreground="muted" size="sm">
              Prioridade
            </Text>
            <SelectProperty
              ariaLabel="Prioridade"
              onValueChange={setPriority}
              options={priorityOptions}
              value={priority}
              variant="plain"
            />
          </KanbanCardBodyRow>
          <KanbanCardBodyRow align="start" data-kanban-card-action="">
            <Text foreground="muted" size="sm">
              Prazo
            </Text>
            <DateProperty
              ariaLabel="Prazo"
              locale="pt-BR"
              readOnly
              value="2026-10-04"
              variant="plain"
            />
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
              <CardOwner />
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
