import type { Meta, StoryObj } from '@storybook/react-vite'
import { formatShortDate } from '@tc96/helpers/date'
import { formatAmount } from '@tc96/helpers/format'
import {
  KanbanCard,
  type KanbanCardProps,
  KanbanCardSkeleton,
  PersonProperty,
  SelectProperty,
} from '@tc96/parttens'
import {
  BanknoteIcon,
  CalendarIcon,
  CircleDotIcon,
  FileTextIcon,
  ListTodoIcon,
} from 'lucide-react'
import { type ReactElement, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  type DealStage,
  initialDeals,
  isDealStage,
  stageOptions,
} from '../../fixtures/deals'
import { personOptions } from '../../fixtures/task-fields'
import { TIME_ZONE } from '../../fixtures/tasks'

const LOCALE = 'pt-BR'

const deal = initialDeals.find(({ id }) => id === 'DEAL-204') ?? initialDeals[0]

const dealValue = formatAmount(deal.value, {
  currency: 'BRL',
  locale: LOCALE,
  maximumFractionDigits: 0,
})

type DealCardArgs = Pick<
  KanbanCardProps,
  'density' | 'dimmed' | 'display' | 'selected' | 'variant'
> & {
  loading?: boolean
  onCreateTask: () => void
  onEdit: () => void
  onOpen: () => void
  onStageChange: (stage: DealStage) => void
  render?: ReactElement
}

function PipelineDealCard({
  loading = false,
  onCreateTask,
  onEdit,
  onOpen,
  onStageChange,
  variant = 'default',
  ...props
}: Readonly<DealCardArgs>) {
  const [ownerId, setOwnerId] = useState(deal.ownerId)
  const [stage, setStage] = useState<DealStage>(deal.stage)

  if (loading) {
    return (
      <div className="w-72 p-4">
        <KanbanCardSkeleton {...props} label="Carregando negócio" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="w-72">
        <KanbanCard
          {...props}
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
              count: 2,
              icon: <ListTodoIcon aria-hidden />,
              id: 'tasks',
              items: [
                { label: 'Criar tarefa', onSelect: onCreateTask },
                { label: 'Ver tarefas' },
              ],
              label: 'Tarefas: 2',
            },
          ]}
          description={deal.contact}
          fields={[
            {
              content: (
                <SelectProperty
                  ariaLabel="Etapa"
                  onValueChange={(value) => {
                    if (!value || !isDealStage(value)) return
                    setStage(value)
                    onStageChange(value)
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
              content: dealValue,
              icon: <BanknoteIcon aria-hidden />,
              id: 'value',
              label: 'Valor',
            },
          ]}
          menu={{
            items: [
              { label: 'Editar negócio', onSelect: onEdit },
              { label: 'Duplicar negócio' },
            ],
            label: 'Mais ações do negócio',
          }}
          onOpen={variant === 'interactive' ? onOpen : undefined}
          openLabel={`Abrir negócio ${deal.company}`}
          title={deal.company}
          variant={variant}
        />
      </div>
    </div>
  )
}

const meta = {
  args: {
    onCreateTask: fn(),
    onEdit: fn(),
    onOpen: fn(),
    onStageChange: fn(),
  },
  render: (args) => <PipelineDealCard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Card Behavior',
} satisfies Meta<DealCardArgs>

export default meta
type Story = StoryObj<typeof meta>

const RING = '0px 0px 0px 4px'
const openLabel = `Abrir negócio ${deal.company}`

export const DealAtRest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('article')
    const column = card.parentElement as HTMLElement

    await expect(card).toHaveAttribute('data-variant', 'default')
    await expect(card).toHaveAttribute('data-display', 'full')
    await expect(card).not.toHaveAttribute('data-state')
    await expect(card.getBoundingClientRect().width).toBeCloseTo(
      column.getBoundingClientRect().width,
      0,
    )
    await expect(getComputedStyle(card).borderTopStyle).not.toBe('dashed')
    await expect(getComputedStyle(card).boxShadow).not.toContain(RING)
    await expect(
      canvas.queryByRole('button', { name: openLabel }),
    ).not.toBeInTheDocument()

    await expect(canvas.getByText(deal.company)).toBeVisible()
    await expect(canvas.getByText(deal.contact)).toBeVisible()
    await expect(canvas.getByRole('combobox', { name: /^Etapa/ })).toBeVisible()
    await expect(
      canvasElement.querySelector(`time[datetime="${deal.closeDate}"]`),
    ).toBeVisible()
    await expect(canvas.getByText(dealValue.replace(/\s/g, ' '))).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Notas: 1' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tarefas: 2' }),
    ).toBeVisible()
    await expect(
      canvas.getAllByRole('combobox', { name: /^Responsável/ }),
    ).toHaveLength(1)
  },
}

export const SelectedDeal: Story = {
  args: { selected: true },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')
    await expect(card).toHaveAttribute('data-state', 'selected')
    await expect(getComputedStyle(card).boxShadow).toContain(RING)
  },
}

export const DealBeingMoved: Story = {
  args: { dimmed: true },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('article')
    await expect(getComputedStyle(card).borderTopStyle).toBe('dashed')
    await expect(getComputedStyle(card).boxShadow).not.toContain(RING)
  },
}

export const CompactDeal: Story = {
  args: { display: 'compact' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('article')

    await expect(card).toHaveAttribute('data-display', 'compact')
    await expect(canvas.getByText(deal.company)).toBeVisible()
    await expect(canvas.getByText(deal.contact)).not.toBeVisible()
    await expect(
      canvasElement.querySelector(`time[datetime="${deal.closeDate}"]`),
    ).not.toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tarefas: 2' }),
    ).not.toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Mais ações do negócio' }),
    ).toBeVisible()
    await expect(
      canvas.getAllByRole('combobox', { name: /^Responsável/ }),
    ).toHaveLength(1)
  },
}

export const SpaciousDeal: Story = {
  args: { density: 'md' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('article')).toHaveAttribute(
      'data-density',
      'md',
    )
  },
}

export const OpenDealFromCard: Story = {
  args: { variant: 'interactive' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('article')
    const open = canvas.getByRole('button', { name: openLabel })

    await expect(card).toHaveAttribute('data-variant', 'interactive')
    await expect(canvasElement.querySelector('button button')).toBeNull()

    await userEvent.click(open)
    await expect(args.onOpen).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Tab}')
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    await expect(open).toHaveFocus()
    await expect(getComputedStyle(card).boxShadow).toContain(RING)
  },
}

export const ChangeStageWithoutOpening: Story = {
  args: { variant: 'interactive' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const stage = canvas.getByRole('combobox', { name: /^Etapa/ })
    const box = stage.getBoundingClientRect()
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2,
    )

    await expect(stage.contains(hit)).toBe(true)

    await userEvent.click(stage)
    await userEvent.click(await body.findByRole('option', { name: 'Proposta' }))

    await expect(args.onStageChange).toHaveBeenCalledWith('proposal')
    await expect(
      canvas.getByRole('combobox', { name: 'Etapa: Proposta' }),
    ).toBeVisible()
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const DealMenuAndCounts: Story = {
  args: { variant: 'interactive' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais ações do negócio' }),
    )
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Editar negócio' }),
    )
    await expect(args.onEdit).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await userEvent.click(canvas.getByRole('button', { name: 'Tarefas: 2' }))
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Criar tarefa' }),
    )
    await expect(args.onCreateTask).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const DealAsRegion: Story = {
  args: {
    render: <section aria-label={`Negócio ${deal.company}`} />,
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', {
      name: `Negócio ${deal.company}`,
    })

    await expect(region).toHaveAttribute('data-state', 'selected')
    await expect(canvas.queryByRole('article')).not.toBeInTheDocument()
    await expect(within(region).getByText(deal.company)).toBeVisible()
  },
}

export const LoadingDeal: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('status', { name: 'Carregando negócio' }),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('article')).not.toBeInTheDocument()
  },
}

export const LoadingCompactDeal: Story = {
  args: { display: 'compact', loading: true },
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole('status', {
      name: 'Carregando negócio',
    })
    await expect(
      status.querySelector('[data-pattern="kanban-card"]'),
    ).toHaveAttribute('data-display', 'compact')
  },
}
