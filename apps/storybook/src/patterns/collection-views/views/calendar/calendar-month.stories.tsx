import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTitle,
  CalendarView,
  type CalendarViewProps,
} from '@tc96/parttens'
import type { ReactElement } from 'react'
import { expect } from 'storybook/test'
import { booleanArgType } from '../../../../test-utils/story-arg-types'

interface MechanicsItem {
  end: string | null
  id: string
  isAllDay?: boolean
  kind: 'appointment' | 'event' | 'task'
  start: string
  title: string
}

const TIME_ZONE = 'America/Fortaleza'
// Fixtures fixas: âncora e "agora" estáveis mantêm a story determinística.
const ANCHOR = new Date('2026-08-12T12:00:00.000Z')
const NOW = new Date('2026-08-12T15:00:00.000Z')

const KIND_TONE = {
  appointment: 'success',
  event: 'primary',
  task: 'neutral',
} as const

const items: MechanicsItem[] = [
  {
    end: '2026-08-12T18:00:00.000Z',
    id: 'event-1',
    kind: 'event',
    start: '2026-08-12T17:00:00.000Z',
    title: 'Reunião com o cliente',
  },
  {
    end: null,
    id: 'task-1',
    kind: 'task',
    start: '2026-08-13T15:00:00.000Z',
    title: 'Enviar procuração',
  },
  {
    end: '2026-08-14T20:00:00.000Z',
    id: 'appointment-1',
    kind: 'appointment',
    start: '2026-08-14T19:00:00.000Z',
    title: 'Atendimento inicial',
  },
  {
    end: '2026-08-21T03:00:00.000Z',
    id: 'allday-1',
    isAllDay: true,
    kind: 'event',
    start: '2026-08-20T03:00:00.000Z',
    title: 'Plantão',
  },
]

const overflowItems: MechanicsItem[] = ['a', 'b', 'c', 'd', 'e'].map(
  (id, index) => ({
    end: null,
    id: `overflow-${id}`,
    kind: 'task',
    start: `2026-08-18T1${index}:00:00.000Z`,
    title: `Item ${id.toUpperCase()}`,
  }),
)

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
  mode: 'month' as const,
  now: NOW,
  renderItem: (item: MechanicsItem) => (
    <CalendarEventChip
      completed={item.id === 'task-1'}
      tone={KIND_TONE[item.kind]}
    >
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
  maxVisibleMonthItems,
  withReschedule = true,
}: Readonly<{
  itemsOverride?: MechanicsItem[]
  loading?: boolean
  maxVisibleMonthItems?: number
  withReschedule?: boolean
}>) {
  return (
    <div className="min-w-0 p-4">
      <CalendarView
        {...calendarArgs}
        collection={{
          ...calendarArgs.collection,
          items: itemsOverride ?? items,
        }}
        loading={loading}
        loadingItemLabel="Carregando compromisso"
        onItemReschedule={withReschedule && !loading ? () => true : undefined}
        onSelectDay={() => undefined}
        {...(maxVisibleMonthItems === undefined
          ? {}
          : { maxVisibleMonthItems })}
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
          'Building Block de calendário no modo mês. Documenta bucketização por dia no fuso da view, chips por tom, overflow "+N", loading e arraste entre dias sem vocabulário de domínio.',
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/CollectionViews/Views/Calendar/Month',
} satisfies Meta<typeof MechanicsCalendarView>

export default meta

type Story = StoryObj<typeof meta>

export const Month: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    // 17:00Z é 14:00 em Fortaleza: o chip pertence ao dia 12 no fuso da view.
    const cell = canvasElement.querySelector(
      '[data-calendar-date="2026-08-12"]',
    )
    await expect(
      cell?.querySelector('[data-calendar-item-id="event-1"]'),
    ).not.toBeNull()

    const today = canvasElement.querySelector(
      '[data-calendar-date="2026-08-12"]',
    )
    await expect(today?.hasAttribute('data-today')).toBe(true)
  },
  render: () => <Example />,
}

export const WithTones: Story = {
  args: calendarArgs,
  parameters: {
    docs: {
      description: {
        story:
          'O tom é vocabulário visual neutro: o consumer mapeia o domínio (tarefa, evento, atendimento) para `tone`, e concluído ganha distinção sem sumir.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-tone="success"]'),
    ).not.toBeNull()
    const completed = canvasElement.querySelector<HTMLElement>(
      '[data-completed] [data-slot="calendar-event-chip-title"]',
    )
    await expect(completed).not.toBeNull()
    await expect(
      getComputedStyle(completed as HTMLElement).textDecorationLine,
    ).toBe('line-through')
  },
  render: () => <Example />,
}

export const Overflow: Story = {
  args: calendarArgs,
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector(
      '[data-calendar-date="2026-08-18"]',
    )
    await expect(
      cell?.querySelectorAll('[data-calendar-item-id]'),
    ).toHaveLength(3)

    const overflow = Array.from(cell?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === '+2',
    )
    await expect(overflow).toBeDefined()
  },
  render: () => (
    <Example itemsOverride={overflowItems} maxVisibleMonthItems={3} />
  ),
}

export const Loading: Story = {
  args: calendarArgs,
  render: () => <Example loading />,
}

export const DndDisabled: Story = {
  args: calendarArgs,
  parameters: {
    docs: {
      description: {
        story:
          'Sem `onItemReschedule`, nenhum chip é arrastável e o cursor segue normal.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-calendar-item-draggable]'),
    ).toBeNull()
  },
  render: () => <Example withReschedule={false} />,
}
