import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  CalendarView,
  type CalendarViewProps,
} from 'tc96/blocks'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { expect } from 'storybook/test'
import { booleanArgType } from '../../../../test-utils/story-arg-types'

interface MechanicsItem {
  end: string | null
  id: string
  isAllDay?: boolean
  start: string
  title: string
}

const TIME_ZONE = 'America/Fortaleza'
const ANCHOR = new Date('2026-08-12T12:00:00.000Z')
const NOW = new Date('2026-08-12T15:00:00.000Z')

// 10:30–12:00 em Fortaleza (13:30Z–15:00Z): topo 43.75% e altura 6.25% do dia.
const items: MechanicsItem[] = [
  {
    end: '2026-08-12T15:00:00.000Z',
    id: 'positioned',
    start: '2026-08-12T13:30:00.000Z',
    title: 'Sessão de posicionamento',
  },
  {
    end: '2026-08-13T03:00:00.000Z',
    id: 'allday',
    isAllDay: true,
    start: '2026-08-12T03:00:00.000Z',
    title: 'Plantão',
  },
]

const overlapItems: MechanicsItem[] = [
  {
    end: '2026-08-12T15:00:00.000Z',
    id: 'overlap-a',
    start: '2026-08-12T13:00:00.000Z',
    title: 'Bloco A',
  },
  {
    end: '2026-08-12T15:30:00.000Z',
    id: 'overlap-b',
    start: '2026-08-12T14:00:00.000Z',
    title: 'Bloco B',
  },
]

const calendarArgs = {
  anchor: ANCHOR,
  collection: {
    getKey: (item: MechanicsItem) => item.id,
    getLabel: (item: MechanicsItem) => item.title,
    groupings: [],
    items,
  },
  getItemSchedule: (item: MechanicsItem) => ({
    end: item.end ? new Date(item.end) : null,
    isAllDay: item.isAllDay ?? false,
    start: new Date(item.start),
  }),
  mode: 'week' as const,
  now: NOW,
  renderItem: (item: MechanicsItem, context: { placement: string }) => (
    <CalendarEventChip
      display={context.placement === 'time-grid' ? 'block' : 'chip'}
      tone="primary"
    >
      <CalendarEventChipTime>10:30</CalendarEventChipTime>
      <CalendarEventChipTitle>{item.title}</CalendarEventChipTitle>
      <CalendarEventChipOpenTrigger aria-label={`Abrir ${item.title}`} />
    </CalendarEventChip>
  ),
  timeZone: TIME_ZONE,
}

const MechanicsCalendarView = CalendarView as (
  props: CalendarViewProps<MechanicsItem>,
) => ReactElement

function Example({
  itemsOverride,
  loading = false,
  mode = 'week',
}: Readonly<{
  itemsOverride?: MechanicsItem[]
  loading?: boolean
  mode?: 'day' | 'week'
}>) {
  return (
    <div className="h-160 min-w-0 p-4">
      <CalendarView
        {...calendarArgs}
        collection={{
          ...calendarArgs.collection,
          items: itemsOverride ?? items,
        }}
        loading={loading}
        loadingItemLabel="Carregando compromisso"
        mode={mode}
        onItemReschedule={loading ? undefined : () => true}
      />
    </div>
  )
}

const meta = {
  args: calendarArgs,
  argTypes: {
    loading: booleanArgType,
    mode: { control: 'inline-radio', options: ['day', 'week', 'month'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
  },
  component: MechanicsCalendarView,
  parameters: {
    docs: {
      description: {
        component:
          'Building Block de calendário nos modos semana e dia: eixo de horas, faixa de dia inteiro, blocos posicionados por hora com altura proporcional à duração, sobreposição em lanes e linha do instante corrente.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/CollectionViews/Views/Calendar/Time Grid',
} satisfies Meta<typeof MechanicsCalendarView>

export default meta

type Story = StoryObj<typeof meta>

export const Week: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-08-12"]',
    )
    const block = column?.querySelector<HTMLElement>(
      '[data-calendar-item-id="positioned"]',
    )
    if (!column || !block)
      throw new Error('A story não posicionou o bloco na coluna do dia 12.')

    // O wrapper posicionado é o pai imediato do draggable.
    const positioned = block.parentElement as HTMLElement
    const columnRect = column.getBoundingClientRect()
    const blockRect = positioned.getBoundingClientRect()
    const topPct = ((blockRect.top - columnRect.top) / columnRect.height) * 100
    const heightPct = (blockRect.height / columnRect.height) * 100

    // 10:30 → 43.75% do dia; 1h30 → 6.25% do dia.
    await expect(Math.abs(topPct - 43.75)).toBeLessThan(0.5)
    await expect(Math.abs(heightPct - 6.25)).toBeLessThan(0.5)

    // A linha "agora" existe só na coluna de hoje.
    await expect(
      canvasElement.querySelectorAll('[data-slot="calendar-now-line"]'),
    ).toHaveLength(1)
  },
  render: () => <Example />,
}

export const WeekOverlap: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-08-12"]',
    )
    const first = column?.querySelector<HTMLElement>(
      '[data-calendar-item-id="overlap-a"]',
    )
    const second = column?.querySelector<HTMLElement>(
      '[data-calendar-item-id="overlap-b"]',
    )
    if (!column || !first || !second)
      throw new Error('A story não montou os blocos sobrepostos.')

    const columnWidth = column.getBoundingClientRect().width
    const firstRect = (
      first.parentElement as HTMLElement
    ).getBoundingClientRect()
    const secondRect = (
      second.parentElement as HTMLElement
    ).getBoundingClientRect()

    // Sobrepostos dividem a coluna lado a lado, metade para cada lane.
    await expect(Math.abs(firstRect.width - columnWidth / 2)).toBeLessThan(2)
    await expect(Math.abs(secondRect.width - columnWidth / 2)).toBeLessThan(2)
    await expect(secondRect.left).toBeGreaterThan(firstRect.left)
  },
  render: () => <Example itemsOverride={overlapItems} />,
}

export const AllDay: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const strip = canvasElement.querySelector(
      '[data-calendar-all-day-date="2026-08-12"]',
    )
    await expect(
      strip?.querySelector('[data-calendar-item-id="allday"]'),
    ).not.toBeNull()

    // O item de dia inteiro não vira bloco na coluna de horas.
    const column = canvasElement.querySelector(
      '[data-calendar-date="2026-08-12"]',
    )
    await expect(
      column?.querySelector('[data-calendar-item-id="allday"]'),
    ).toBeNull()
  },
  render: () => <Example />,
}

export const Day: Story = {
  args: calendarArgs,
  render: () => <Example mode="day" />,
}

export const Loading: Story = {
  args: calendarArgs,
  render: () => <Example loading />,
}
