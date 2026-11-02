import type { Meta, StoryObj } from '@storybook/react-vite'
import { formatShortDate } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  KanbanCard,
  type KanbanCardProps,
  PersonProperty,
  SelectProperty,
} from '@tc96/parttens'
import {
  BanknoteIcon,
  CalendarIcon,
  CircleDotIcon,
  Clock3Icon,
  FileTextIcon,
  HourglassIcon,
  ListTodoIcon,
  MessageCircleIcon,
  TimerIcon,
} from 'lucide-react'
import { useState } from 'react'
import {
  type DealStage,
  initialDeals,
  isDealStage,
  stageOptions,
} from '../../fixtures/deals'
import { personOptions } from '../../fixtures/task-fields'
import { TIME_ZONE } from '../../fixtures/tasks'

const hoursIcons = {
  clock: <Clock3Icon aria-hidden />,
  hourglass: <HourglassIcon aria-hidden />,
  timer: <TimerIcon aria-hidden />,
}

type CardsArgs = Pick<
  KanbanCardProps,
  'dimmed' | 'display' | 'selected' | 'variant'
> & {
  hoursIcon: keyof typeof hoursIcons
  hoursValue: string
}

const meta = {
  args: { hoursIcon: 'clock', hoursValue: '12 h' },
  argTypes: {
    display: { control: 'inline-radio', options: ['full', 'compact'] },
    hoursIcon: {
      control: 'select',
      description: 'Icon of the hours row in `fields`.',
      options: Object.keys(hoursIcons),
    },
    hoursValue: {
      control: 'text',
      description: 'Value of the hours row in `fields`.',
    },
    variant: { control: 'inline-radio', options: ['default', 'interactive'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Kanban card anatomy and states over a Pipeline deal. The card owns the layout; a consumer passes `title`, `description`, `menu`, `fields`, `counts` and `assignee`.',
      },
    },
  },
  render: (args) => <ContextCard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Cards',
} satisfies Meta<CardsArgs>

export default meta
type Story = StoryObj<typeof meta>

const LOCALE = 'pt-BR'

const deal = initialDeals.find(({ id }) => id === 'DEAL-204') ?? initialDeals[0]

function ContextCard({
  dimmed = false,
  display = 'full',
  hoursIcon,
  hoursValue,
  selected = false,
  variant = 'default',
}: Readonly<CardsArgs>) {
  const interactive = variant === 'interactive'
  const [ownerId, setOwnerId] = useState(deal.ownerId)
  const [stage, setStage] = useState<DealStage>(deal.stage)

  return (
    <div className="w-80 p-4">
      <KanbanCard
        assignee={
          <PersonProperty
            ariaLabel="Responsável"
            avatarSize="sm"
            display="avatar"
            onValueChange={setOwnerId}
            options={personOptions}
            value={ownerId}
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
            id: 'tasks',
            items: [{ label: 'Criar tarefa' }, { label: 'Ver tarefas' }],
            label: 'Tarefas: 1',
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
        description={deal.contact}
        dimmed={dimmed}
        display={display}
        fields={[
          {
            content: (
              <SelectProperty
                ariaLabel="Etapa"
                onValueChange={(value) => {
                  if (value && isDealStage(value)) setStage(value)
                }}
                options={stageOptions}
                value={stage}
                variant="plain"
              />
            ),
            icon: <CircleDotIcon aria-hidden />,
            id: 'stage',
            label: 'Etapa',
            interactive: true,
          },
          {
            content: (
              <time dateTime={deal.closeDate}>
                {formatShortDate(
                  new Date(`${deal.closeDate}T12:00:00Z`),
                  LOCALE,
                  TIME_ZONE,
                )}
              </time>
            ),
            icon: <CalendarIcon aria-hidden />,
            id: 'close-date',
            label: 'Prazo',
          },
          {
            content: formatAmount(deal.value, {
              currency: 'BRL',
              locale: LOCALE,
              maximumFractionDigits: 0,
            }),
            icon: <BanknoteIcon aria-hidden />,
            id: 'value',
            label: 'Valor',
          },
          {
            content: hoursValue,
            icon: hoursIcons[hoursIcon],
            id: 'hours',
            label: 'Horas',
          },
        ]}
        menu={{
          items: [{ label: 'Editar negócio' }, { label: 'Duplicar negócio' }],
          label: 'Mais ações do negócio',
        }}
        onOpen={interactive ? () => undefined : undefined}
        openLabel="Abrir negócio"
        selected={selected}
        title={deal.company}
        variant={variant}
      />
    </div>
  )
}

export const Default: Story = {}
export const Compact: Story = {
  args: { display: 'compact' },
}
export const Selected: Story = {
  args: { selected: true },
}
export const Moving: Story = {
  args: { dimmed: true },
}
export const Interactive: Story = {
  args: { variant: 'interactive' },
}
