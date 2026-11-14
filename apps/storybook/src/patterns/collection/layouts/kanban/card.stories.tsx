import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardBody,
  KanbanCardControl,
  KanbanCardDescription,
  KanbanCardField,
  KanbanCardFieldLabel,
  KanbanCardFieldValue,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardOpenTrigger,
  type KanbanCardProps,
  KanbanCardSkeleton,
  type KanbanCardSkeletonAnatomy,
  KanbanCardTitle,
} from '@tc96/parttens'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../../test-utils/sleep'
import { type Deal, type DealStage, initialDeals } from '../../fixtures/deals'
import { DealCard } from '../../fixtures/pipeline-usage'

interface CardArgs
  extends Pick<
    KanbanCardProps,
    'density' | 'dimmed' | 'display' | 'selected' | 'variant'
  > {
  description: boolean
  fields: boolean
  footer: boolean
  loading: boolean
  menu: boolean
  trigger: boolean
}

const hidden = { table: { disable: true } } as const
const onOpen = fn()
const LOAD_DELAY = 2000

const dealAnatomy: KanbanCardSkeletonAnatomy = {
  assignee: true,
  counts: 3,
  descriptionLines: 1,
  fields: 3,
  menu: true,
}

const usage = `
import {
  KanbanCard,
  KanbanCardAction,
  KanbanCardBody,
  KanbanCardControl,
  KanbanCardDescription,
  KanbanCardField,
  KanbanCardFieldLabel,
  KanbanCardFieldValue,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardOpenTrigger,
  KanbanCardTitle,
} from '@acme/patterns'

<KanbanCard density="sm" variant="interactive">
  <KanbanCardOpenTrigger aria-label="Abrir negócio" onClick={open} />
  <KanbanCardHeader>
    <KanbanCardTitle>{deal.company}</KanbanCardTitle>
    <KanbanCardDescription>{deal.contact}</KanbanCardDescription>
    <KanbanCardAction>{menu}</KanbanCardAction>
  </KanbanCardHeader>
  <KanbanCardBody>
    <KanbanCardField>
      <KanbanCardFieldLabel>{icon} Etapa</KanbanCardFieldLabel>
      <KanbanCardFieldValue interactive>{stageSelect}</KanbanCardFieldValue>
    </KanbanCardField>
  </KanbanCardBody>
  <KanbanCardFooter>
    <KanbanCardControl>{countMenus}</KanbanCardControl>
    <KanbanCardControl>{assignee}</KanbanCardControl>
  </KanbanCardFooter>
</KanbanCard>
`

const docs = {
  api: [
    {
      description:
        'Structural root: a COSS `Card` rendered as `article`, with no content props. `display` is `full` or `compact` (header only: description, body and footer hide), `density` is `sm` or `md`, `selected` draws the ring, `dimmed` the dashed border of a card being moved, and `variant="interactive"` the pointer and focus ring of a card that opens.',
      name: 'KanbanCard',
    },
    {
      description:
        'Button stretched over the card that opens the record; it is the keyboard path, named by `aria-label`. Without it the card has no button of its own.',
      name: 'KanbanCardOpenTrigger',
    },
    {
      description:
        '`KanbanCardHeader` holds `KanbanCardTitle`, `KanbanCardDescription` (three lines in `full`, hidden in `compact`) and `KanbanCardAction`, the header cell for a menu built with `KanbanCardActionButton`.',
      name: 'KanbanCardHeader',
    },
    {
      description:
        'Two-column grid of fields, hidden in `compact`. Each `KanbanCardField` is a row: `KanbanCardFieldLabel` (icon and label) and `KanbanCardFieldValue`; `interactive` raises a value that is a control above the open trigger.',
      name: 'KanbanCardBody',
    },
    {
      description:
        'Footer row, hidden in `compact`. Wrap controls (count menus, the assignee) in `KanbanCardControl`, which keeps them above the open trigger.',
      name: 'KanbanCardFooter',
    },
    {
      description:
        'Loading card shaped by `descriptionLines`, `fields`, `counts`, `menu` and `assignee`, at the real line heights of the card. `KanbanView` renders it from `loadingCardAnatomy`.',
      name: 'KanbanCardSkeleton',
    },
  ],
  description: {
    component:
      '`KanbanCard` is the structural card for `KanbanView`: a root and slots, with no content of its own. `Anatomy` shows the slots, driven by the controls. `Usage` is the Pipeline deal card with the same controls, and `loading` renders `KanbanCardSkeleton` with its anatomy. `Behavior` is the usage under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-12 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

const Slot = ({ name }: Readonly<{ name: string }>) => (
  <span className={slotClassName}>{name}</span>
)

function DealPreview({
  loading,
  ...cardProps
}: Readonly<
  Pick<
    CardArgs,
    'density' | 'dimmed' | 'display' | 'loading' | 'selected' | 'variant'
  >
>) {
  const [deal, setDeal] = useState<Deal>(initialDeals[0] as Deal)

  if (loading)
    return (
      <KanbanCardSkeleton
        {...dealAnatomy}
        {...cardProps}
        label="Carregando negócio"
      />
    )

  return (
    <DealCard
      {...cardProps}
      deal={deal}
      onOpen={onOpen}
      onOwnerChange={(ownerId) =>
        setDeal((current) => ({ ...current, ownerId }))
      }
      onStageChange={(stage: DealStage) =>
        setDeal((current) => ({ ...current, stage }))
      }
    />
  )
}

function LoadingDeal() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <DealPreview loading={loading} />
}

const meta = {
  args: {
    density: 'sm',
    description: true,
    dimmed: false,
    display: 'full',
    fields: true,
    footer: true,
    loading: false,
    menu: true,
    selected: false,
    trigger: true,
    variant: 'default',
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['sm', 'md'] },
    description: { control: 'boolean' },
    dimmed: { control: 'boolean' },
    display: { control: 'inline-radio', options: ['full', 'compact'] },
    fields: { control: 'boolean' },
    footer: { control: 'boolean' },
    loading: { control: 'boolean' },
    menu: { control: 'boolean' },
    selected: { control: 'boolean' },
    trigger: { control: 'boolean' },
    variant: { control: 'inline-radio', options: ['default', 'interactive'] },
  },
  component: KanbanCard,
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Kanban/Card',
} satisfies Meta<CardArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  argTypes: { loading: hidden },
  play: async ({ args, canvasElement }) => {
    if (args.display === 'compact') return
    await expect(
      [...canvasElement.querySelectorAll('[data-slot^="kanban-card-"]')].map(
        (node) => node.getAttribute('data-slot'),
      ),
    ).toEqual([
      'kanban-card-open-trigger',
      'kanban-card-field',
      'kanban-card-field-label',
      'kanban-card-field-value',
      'kanban-card-control',
    ])
  },
  render: ({
    description,
    fields,
    footer,
    loading: _loading,
    menu,
    trigger,
    ...cardProps
  }) => (
    <KanbanCard {...cardProps}>
      {trigger ? <KanbanCardOpenTrigger aria-label="OpenTrigger" /> : null}
      <KanbanCardHeader>
        <KanbanCardTitle>
          <Slot name="Title" />
        </KanbanCardTitle>
        {description ? (
          <KanbanCardDescription>
            <Slot name="Description" />
          </KanbanCardDescription>
        ) : null}
        {menu ? (
          <KanbanCardAction>
            <Slot name="Action" />
          </KanbanCardAction>
        ) : null}
      </KanbanCardHeader>
      {fields ? (
        <KanbanCardBody>
          <KanbanCardField>
            <KanbanCardFieldLabel>
              <Slot name="FieldLabel" />
            </KanbanCardFieldLabel>
            <KanbanCardFieldValue>
              <Slot name="FieldValue" />
            </KanbanCardFieldValue>
          </KanbanCardField>
        </KanbanCardBody>
      ) : null}
      {footer ? (
        <KanbanCardFooter>
          <KanbanCardControl>
            <Slot name="Control" />
          </KanbanCardControl>
        </KanbanCardFooter>
      ) : null}
    </KanbanCard>
  ),
}

export const Usage: Story = {
  argTypes: {
    description: hidden,
    fields: hidden,
    footer: hidden,
    menu: hidden,
    trigger: hidden,
  },
  render: ({ density, dimmed, display, loading, selected, variant }) => (
    <DealPreview
      {...(density ? { density } : {})}
      {...(display ? { display } : {})}
      dimmed={dimmed ?? false}
      loading={loading}
      selected={selected ?? false}
      {...(variant ? { variant } : {})}
    />
  ),
}

export const Behavior: Story = {
  argTypes: {
    density: hidden,
    description: hidden,
    dimmed: hidden,
    display: hidden,
    fields: hidden,
    footer: hidden,
    loading: hidden,
    menu: hidden,
    selected: hidden,
    trigger: hidden,
    variant: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const deal = initialDeals[0] as Deal

    const skeleton = canvas.getByRole('status', { name: 'Carregando negócio' })
    await expect(skeleton.dataset.fields).toBe('3')
    const skeletonHeight = canvasElement
      .querySelector('[data-pattern="kanban-card"]')
      ?.getBoundingClientRect().height

    await canvas.findByText(deal.company, undefined, {
      timeout: LOAD_DELAY * 2,
    })
    const card = canvas.getByRole('article')
    await expect(card.getBoundingClientRect().height).toBe(skeletonHeight)
    await expect(card).toHaveAttribute('data-variant', 'interactive')
    await expect(canvasElement.querySelector('button button')).toBeNull()

    onOpen.mockClear()
    await userEvent.click(
      canvas.getByRole('button', { name: `Abrir negócio ${deal.company}` }),
    )
    await expect(onOpen).toHaveBeenCalledTimes(1)

    await userEvent.click(canvas.getByRole('combobox', { name: /^Etapa/ }))
    await userEvent.click(await body.findByRole('option', { name: 'Ganho' }))
    await expect(
      canvas.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Ganho')
    await expect(onOpen).toHaveBeenCalledTimes(1)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais ações do negócio' }),
    )
    await expect(
      await body.findByRole('menuitem', { name: 'Editar negócio' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')

    await userEvent.click(canvas.getByRole('button', { name: 'Notas: 1' }))
    await expect(
      await body.findByRole('menuitem', { name: 'Criar nota' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(onOpen).toHaveBeenCalledTimes(1)
  },
  render: () => <LoadingDeal />,
}
