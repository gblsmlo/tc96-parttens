import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import {
  ANCHOR,
  type CalendarTestRecord,
  CalendarViewHarness,
  renderChip,
} from '../../fixtures/calendar-view-harness'

const DAY_LABEL = 'quarta-feira, 12 de agosto de 2026'

const at = (
  id: string,
  start: string,
  end: string | null = null,
  title = `Item ${id}`,
): CalendarTestRecord => ({ end, id, start, title })

const overflowRecords = ['a', 'b', 'c', 'd', 'e'].map((id, index) =>
  at(id, `2026-08-12T1${index}:00:00.000Z`),
)

const timedRecord = at(
  'timed',
  '2026-08-12T17:00:00.000Z',
  '2026-08-12T18:00:00.000Z',
  'Reunião',
)

const columnOf = (canvasElement: HTMLElement, day: string) => {
  const column = canvasElement.querySelector<HTMLElement>(
    `[data-slot="calendar-time-grid"] [data-calendar-date="${day}"]`,
  )
  if (!column) throw new Error(`column ${day} not found`)
  return column
}

const pointerAt = (column: HTMLElement, minute: number) => {
  const rect = column.getBoundingClientRect()
  return {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + (rect.height * minute) / 1440,
  }
}

const meta = {
  args: {
    anchor: ANCHOR,
    mode: 'month',
    records: [],
    renderRecord: renderChip,
  },
  argTypes: {
    anchor: { control: false },
    mode: { control: 'inline-radio', options: ['month', 'week', 'day'] },
    onRecordReschedule: { control: false },
    onSelectDay: { control: false },
    onSelectSlot: { control: false },
    records: { control: false },
    renderRecord: { control: false },
  },
  component: CalendarViewHarness,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Calendar/View',
} satisfies Meta<typeof CalendarViewHarness>

export default meta
type Story = StoryObj<typeof meta>

export const MonthPlacesByTimeZone: Story = {
  args: {
    records: [at('late', '2026-08-29T02:00:00.000Z', null, 'Ligação tardia')],
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '[data-calendar-date="2026-08-28"] [data-calendar-item-id="late"]',
      ),
    ).not.toBeNull()
    await expect(
      canvasElement.querySelector(
        '[data-calendar-date="2026-08-29"] [data-calendar-item-id]',
      ),
    ).toBeNull()
  },
}

export const MonthMarksTodayAndOutsideDays: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement
        .querySelector('[data-calendar-date="2026-08-12"]')
        ?.hasAttribute('data-today'),
    ).toBe(true)
    await expect(
      canvasElement
        .querySelector('[data-calendar-date="2026-07-27"]')
        ?.hasAttribute('data-outside-month'),
    ).toBe(true)
  },
}

export const MonthLoading: Story = {
  args: {
    loading: true,
    loadingRecordCount: 4,
    loadingRecordLabel: 'Carregando compromisso',
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement
        .querySelector('[data-slot="calendar-view"]')
        ?.getAttribute('aria-busy'),
    ).toBe('true')
    await expect(
      within(canvasElement).getAllByRole('status', {
        name: 'Carregando compromisso',
      }),
    ).toHaveLength(4)
  },
}

export const MonthOverflowPopover: Story = {
  args: {
    maxVisibleMonthRecords: 3,
    records: overflowRecords,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvasElement.querySelectorAll(
        '[data-calendar-date="2026-08-12"] [data-calendar-item-id]',
      ),
    ).toHaveLength(3)
    await expect(
      canvas.getByRole('button', { name: /^Mostrar mais 2 itens de/ }),
    ).toHaveTextContent('+2')

    await userEvent.click(
      canvas.getByRole('button', { name: /^Mostrar mais 2 itens de/ }),
    )
    const popover = await screen.findByRole('dialog', { name: DAY_LABEL })
    await expect(within(popover).getByText('Item d')).toBeInTheDocument()
    await expect(within(popover).getByText('Item e')).toBeInTheDocument()
    await expect(within(popover).queryByText('Item a')).toBeNull()
    await expect(
      within(popover).queryByRole('button', { name: /Mostrar todos os/ }),
    ).toBeNull()
  },
}

const selectDay = fn()

export const MonthOverflowDayTitle: Story = {
  args: {
    maxVisibleMonthRecords: 3,
    onSelectDay: selectDay,
    records: overflowRecords.slice(0, 4),
  },
  play: async ({ canvasElement }) => {
    selectDay.mockClear()
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: /^Mostrar mais 1 item de/ }),
    )
    const title = await screen.findByRole('button', {
      name: /^Mostrar todos os 4 itens de/,
    })
    await expect(title).toHaveTextContent(DAY_LABEL)

    await userEvent.click(title)
    await expect(selectDay).toHaveBeenCalledWith({
      day: 12,
      month: 8,
      year: 2026,
    })
  },
}

export const MonthWithoutRescheduleHasNoHandle: Story = {
  args: {
    records: [at('static', '2026-08-12T14:00:00.000Z', null, 'Sem arraste')],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /^Mover / }),
    ).toBeNull()
    await expect(
      canvasElement.querySelector('[data-calendar-item-draggable]'),
    ).toBeNull()
  },
}

export const MonthWithRescheduleHasHandle: Story = {
  args: {
    onRecordReschedule: fn(() => true),
    records: [at('movable', '2026-08-12T14:00:00.000Z', null, 'Com arraste')],
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Mover Com arraste' }),
    ).toBeInTheDocument()
  },
}

export const WeekSplitsAllDayAndTimed: Story = {
  args: {
    mode: 'week',
    records: [
      {
        ...at(
          'allday',
          '2026-08-12T03:00:00.000Z',
          '2026-08-13T03:00:00.000Z',
          'Dia inteiro',
        ),
        isAllDay: true,
      },
      timedRecord,
    ],
  },
  play: async ({ canvasElement }) => {
    const strip = canvasElement.querySelector(
      '[data-calendar-all-day-date="2026-08-12"]',
    )
    const column = canvasElement.querySelector(
      '[data-calendar-date="2026-08-12"]',
    )

    await expect(
      strip?.querySelector('[data-calendar-item-id="allday"]'),
    ).not.toBeNull()
    await expect(
      strip?.querySelector('[data-calendar-item-id="timed"]'),
    ).toBeNull()
    await expect(
      column?.querySelector('[data-calendar-item-id="timed"]'),
    ).not.toBeNull()
    await expect(
      column?.querySelector('[data-calendar-item-id="allday"]'),
    ).toBeNull()
  },
}

export const DayRendersOneColumn: Story = {
  args: { mode: 'day' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll(
        '[data-slot="calendar-time-grid"] section',
      ),
    ).toHaveLength(1)
    await expect(
      canvasElement.querySelector('[data-calendar-date="2026-08-12"]'),
    ).not.toBeNull()
  },
}

export const NowLineOnCurrentDayOnly: Story = {
  args: { mode: 'week' },
  play: async ({ canvasElement }) => {
    const nowLines = canvasElement.querySelectorAll(
      '[data-slot="calendar-now-line"]',
    )
    await expect(nowLines).toHaveLength(1)
    await expect(
      canvasElement
        .querySelector('[data-calendar-date="2026-08-12"]')
        ?.querySelector('[data-slot="calendar-now-line"]'),
    ).not.toBeNull()
  },
}

const rendered = fn(renderChip)

export const TimeGridRendererReceivesPlacement: Story = {
  args: {
    mode: 'day',
    records: [timedRecord],
    renderRecord: rendered,
  },
  play: async () => {
    await expect(rendered).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'timed' }),
      {
        date: { day: 12, month: 8, year: 2026 },
        endMinutes: 15 * 60,
        isEnd: true,
        isStart: true,
        placement: 'time-grid',
        startMinutes: 14 * 60,
      },
    )
  },
}

export const SlotFromPointerSnapsToQuarterHour: Story = {
  args: {
    mode: 'week',
    onSelectSlot: fn(),
    records: [timedRecord],
  },
  play: async ({ args, canvasElement }) => {
    const column = columnOf(canvasElement, '2026-08-13')
    await userEvent.pointer({
      coords: pointerAt(column, 607),
      keys: '[MouseLeft]',
      target: column,
    })
    await expect(args.onSelectSlot).toHaveBeenCalledWith({
      day: { day: 13, month: 8, year: 2026 },
      endMinutes: 615,
      startMinutes: 600,
    })
  },
}

export const SlotUsesSnapMinutesAsLength: Story = {
  args: {
    mode: 'day',
    onSelectSlot: fn(),
    snapMinutes: 30,
  },
  play: async ({ args, canvasElement }) => {
    const column = columnOf(canvasElement, '2026-08-12')
    await userEvent.pointer({
      coords: pointerAt(column, 610),
      keys: '[MouseLeft]',
      target: column,
    })
    await expect(args.onSelectSlot).toHaveBeenCalledWith({
      day: { day: 12, month: 8, year: 2026 },
      endMinutes: 630,
      startMinutes: 600,
    })
  },
}

export const SlotIgnoresClickOnItem: Story = {
  args: {
    mode: 'day',
    onSelectSlot: fn(),
    records: [timedRecord],
  },
  play: async ({ args, canvasElement }) => {
    const chip = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-item-id="timed"] article',
    )
    if (!chip) throw new Error('item not found')
    await userEvent.click(chip)
    await expect(args.onSelectSlot).not.toHaveBeenCalled()
  },
}

export const SlotIgnoresPressStartedOnItem: Story = {
  args: {
    mode: 'day',
    onSelectSlot: fn(),
    records: [timedRecord],
  },
  play: async ({ args, canvasElement }) => {
    const chip = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-item-id="timed"] article',
    )
    if (!chip) throw new Error('item not found')
    const column = columnOf(canvasElement, '2026-08-12')
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: chip },
      { coords: pointerAt(column, 300), target: column },
      { keys: '[/MouseLeft]' },
    ])
    await expect(args.onSelectSlot).not.toHaveBeenCalled()
  },
}

export const SlotIgnoredWhileLoading: Story = {
  args: {
    loading: true,
    mode: 'day',
    onSelectSlot: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const column = columnOf(canvasElement, '2026-08-12')
    await userEvent.pointer({
      coords: pointerAt(column, 200),
      keys: '[MouseLeft]',
      target: column,
    })
    await expect(args.onSelectSlot).not.toHaveBeenCalled()
  },
}

export const SlotIgnoredInMonthGrid: Story = {
  args: {
    mode: 'month',
    onSelectSlot: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const cell = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-08-12"]',
    )
    if (!cell) throw new Error('cell not found')
    await userEvent.click(cell)
    await expect(args.onSelectSlot).not.toHaveBeenCalled()
  },
}
