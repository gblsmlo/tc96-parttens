import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CircleDollarSignIcon,
  Clock3Icon,
  EllipsisIcon,
  FileTextIcon,
  ListTodoIcon,
  MessageCircleIcon,
  UserRoundIcon,
} from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
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
  type KanbanColumnData,
  KanbanView,
  type KanbanViewProps,
} from 'tc96/blocks'
import { SelectProperty, type SelectPropertyOption } from 'tc96/components'
import { Menu, MenuItem, MenuPopup, MenuTrigger, Text } from 'tc96/ui'

interface SalesDeal {
  assignee: string
  description: string
  id: string
  ownerInitials: string
  property: string
  title: string
  value: string
}

const propertyOptions: readonly SelectPropertyOption[] = [
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' },
  { label: 'Partner', value: 'partner' },
]

const sampleDeal: SalesDeal = {
  assignee: 'Gabriel Melo',
  description: 'Expansão da licença anual para o time comercial.',
  id: 'deal-test',
  ownerInitials: 'G',
  property: 'inbound',
  title: 'Deal test',
  value: 'R$ 24.000',
}

const salesColumns: KanbanColumnData<SalesDeal>[] = [
  {
    cards: [
      sampleDeal,
      {
        ...sampleDeal,
        assignee: 'Marina Costa',
        description: 'Avaliação da solução com a liderança de operações.',
        id: 'northstar',
        ownerInitials: 'M',
        property: 'outbound',
        title: 'Northstar — operação',
        value: 'R$ 48.000',
      },
    ],
    count: 2,
    id: 'new',
    title: 'New',
  },
  {
    cards: [
      {
        ...sampleDeal,
        description: 'Proposta enviada; aguardando retorno do cliente.',
        id: 'orbit-labs',
        property: 'partner',
        title: 'Orbit Labs',
        value: 'R$ 36.000',
      },
    ],
    count: 1,
    id: 'proposal',
    title: 'Proposal',
  },
  { cards: [], count: 0, id: 'won', title: 'Won' },
]

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
          <KanbanCardActionButton aria-label="Mais ações do lead" size="icon" />
        }
      >
        <EllipsisIcon aria-hidden className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem>Editar lead</MenuItem>
        <MenuItem>Mover lead</MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function DealPropertySelect({ value }: Readonly<{ value: string }>) {
  const [property, setProperty] = useState(value)

  return (
    <SelectProperty
      ariaLabel="Source"
      onValueChange={(next) => next && setProperty(next)}
      options={propertyOptions}
      placeholder="Source"
      value={property}
    />
  )
}

function SalesDealCard({ deal }: Readonly<{ deal: SalesDeal }>) {
  return (
    <KanbanCard density="sm">
      <KanbanCardHeader>
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex shrink-0 items-center">
            <span className="size-3.5 rounded-sm bg-muted" />
          </span>
          <KanbanCardTitle className="min-w-0 flex-1 truncate">
            {deal.title}
          </KanbanCardTitle>
        </div>
        <KanbanCardDescription>{deal.description}</KanbanCardDescription>
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
            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-amber-600 text-[10px] text-white">
              {deal.ownerInitials}
            </span>
            {deal.assignee}
          </span>
        </KanbanCardBodyRow>
        <KanbanCardBodyRow>
          <Text
            className="flex min-w-0 items-center gap-2"
            foreground="muted"
            size="sm"
          >
            <CircleDollarSignIcon aria-hidden className="size-3.5" />
            <span>{deal.value}</span>
          </Text>
        </KanbanCardBodyRow>
        <KanbanCardBodyRow data-kanban-card-action="">
          <DealPropertySelect value={deal.property} />
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
              createLabel="Criar tarefa"
              label="Tarefas: 1"
              viewLabel="Ver tarefas"
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
        <span className="ml-auto shrink-0">
          <Text
            className="inline-flex items-center gap-1"
            foreground="muted"
            size="sm"
          >
            <Clock3Icon aria-hidden className="size-3.5" />
            0d
          </Text>
        </span>
      </KanbanCardFooter>
    </KanbanCard>
  )
}

const SalesKanbanView = KanbanView as (
  props: KanbanViewProps<SalesDeal>,
) => ReactElement

function SalesPipelineMechanics() {
  return (
    <div className="h-144 min-w-0 p-4">
      <SalesKanbanView
        columns={salesColumns}
        emptyColumnLabel="No deals in this stage."
        getCardLabel={(deal) => deal.title}
        getKey={(deal) => deal.id}
        onMoveCard={() => true}
        renderCard={(deal) => <SalesDealCard deal={deal} />}
      />
    </div>
  )
}

const meta = {
  args: { deal: sampleDeal },
  component: SalesDealCard,
  tags: ['!autodocs'],
  title: 'Patterns/CollectionViews/Views/Kanban/Usages/Sales',
} satisfies Meta<typeof SalesDealCard>

export default meta
type Story = StoryObj<typeof meta>

export const Card: Story = {
  parameters: { layout: 'centered' },
}

export const Board: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <SalesPipelineMechanics />,
}
