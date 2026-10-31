import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CalendarRecordRenderContext } from '@tc96/parttens'
import { expect, fn, waitFor } from 'storybook/test'
import {
  type CalendarTestRecord,
  CalendarViewScenario,
  createCalendarScenario,
  renderChip,
} from '../../fixtures/calendar-view-harness'

const rendered = fn(
  (record: CalendarTestRecord, _context: CalendarRecordRenderContext) =>
    renderChip(record),
)

const lastContext = (id: string) =>
  rendered.mock.calls.filter(([record]) => record.id === id).at(-1)?.[1]

const lastContextOn = (day: number) =>
  rendered.mock.calls
    .map(([, context]) => context)
    .filter((context) => context.date.day === day)
    .at(-1)

const cellOf = (canvasElement: HTMLElement, id: string) =>
  canvasElement
    .querySelector(`[data-calendar-item-id="${id}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

const span = (start: string, end: string): CalendarTestRecord => ({
  end,
  id: 'span',
  start,
  title: 'Item span',
})

const recordA: CalendarTestRecord = {
  end: '2026-08-12T15:00:00.000Z',
  id: 'a',
  start: '2026-08-12T14:00:00.000Z',
  title: 'Item a',
}
const recordB: CalendarTestRecord = {
  end: '2026-08-13T15:00:00.000Z',
  id: 'b',
  start: '2026-08-13T14:00:00.000Z',
  title: 'Item b',
}
const recordC: CalendarTestRecord = {
  end: '2026-08-14T15:00:00.000Z',
  id: 'c',
  start: '2026-08-14T14:00:00.000Z',
  title: 'Item c',
}
const baseRecords = [recordA, recordB, recordC]

const newScenario = () => ({ scenario: createCalendarScenario() })

const meta = {
  args: {
    anchor: '2026-08-12T12:00:00.000Z',
    mode: 'month',
    records: baseRecords,
    renderRecord: rendered,
  },
  argTypes: {
    anchor: { control: false },
    scenario: { control: false },
    mode: { control: 'inline-radio', options: ['month', 'week', 'day'] },
    records: { control: false },
    renderRecord: { control: false },
  },
  component: CalendarViewScenario,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Calendar/Renderer Context',
} satisfies Meta<typeof CalendarViewScenario>

export default meta
type Story = StoryObj<typeof meta>

export const MinutesChangeOnSameDay: Story = {
  args: { ...newScenario(), mode: 'week' },
  play: async ({ args, canvasElement }) => {
    args.scenario?.update({
      records: [
        {
          ...recordA,
          end: '2026-08-12T17:00:00.000Z',
          start: '2026-08-12T16:00:00.000Z',
        },
        recordB,
        recordC,
      ],
    })

    await waitFor(() =>
      expect(lastContext('a')).toMatchObject({
        date: { day: 12, month: 8, year: 2026 },
        startMinutes: 13 * 60,
      }),
    )
    await expect(cellOf(canvasElement, 'a')).toBe('2026-08-12')
  },
}

export const ItemMovesToAnotherDay: Story = {
  args: { ...newScenario() },
  play: async ({ args, canvasElement }) => {
    args.scenario?.update({
      records: [
        {
          ...recordA,
          end: '2026-08-20T15:00:00.000Z',
          start: '2026-08-20T14:00:00.000Z',
        },
        recordB,
        recordC,
      ],
    })

    await waitFor(() => expect(cellOf(canvasElement, 'a')).toBe('2026-08-20'))
    await expect(lastContext('a')?.date).toEqual({
      day: 20,
      month: 8,
      year: 2026,
    })
  },
}

export const SegmentFlagsFollowNavigation: Story = {
  args: {
    ...newScenario(),
    anchor: '2026-08-12T12:00:00.000Z',
    mode: 'day',
    records: [span('2026-08-12T14:00:00.000Z', '2026-08-13T14:00:00.000Z')],
  },
  play: async ({ args }) => {
    await expect(lastContext('span')).toMatchObject({
      isEnd: false,
      isStart: true,
    })

    args.scenario?.update({ anchor: '2026-08-13T12:00:00.000Z' })

    await waitFor(() =>
      expect(lastContext('span')).toMatchObject({
        date: { day: 13, month: 8, year: 2026 },
        isEnd: true,
        isStart: false,
      }),
    )
  },
}

export const DateFollowsNavigationWithoutFlagChange: Story = {
  args: {
    ...newScenario(),
    anchor: '2026-08-11T12:00:00.000Z',
    mode: 'day',
    records: [span('2026-08-10T14:00:00.000Z', '2026-08-14T14:00:00.000Z')],
  },
  play: async ({ args }) => {
    await expect(lastContext('span')?.date).toEqual({
      day: 11,
      month: 8,
      year: 2026,
    })

    args.scenario?.update({ anchor: '2026-08-12T12:00:00.000Z' })

    await waitFor(() =>
      expect(lastContext('span')).toMatchObject({
        date: { day: 12, month: 8, year: 2026 },
        isEnd: false,
        isStart: false,
      }),
    )
  },
}

export const EndChangeOnSameDayUpdatesFlags: Story = {
  args: {
    ...newScenario(),
    records: [span('2026-08-12T14:00:00.000Z', '2026-08-13T14:00:00.000Z')],
  },
  play: async ({ args }) => {
    await expect(lastContextOn(12)).toMatchObject({
      isEnd: false,
      isStart: true,
    })

    args.scenario?.update({
      records: [span('2026-08-12T14:00:00.000Z', '2026-08-12T15:00:00.000Z')],
    })

    await waitFor(() =>
      expect(lastContextOn(12)).toMatchObject({
        date: { day: 12, month: 8, year: 2026 },
        isEnd: true,
        isStart: true,
      }),
    )
  },
}

export const StartChangeOnSameDayUpdatesFlags: Story = {
  args: {
    ...newScenario(),
    records: [span('2026-08-12T14:00:00.000Z', '2026-08-13T14:00:00.000Z')],
  },
  play: async ({ args }) => {
    await expect(lastContextOn(12)).toMatchObject({
      isStart: true,
    })

    args.scenario?.update({
      records: [span('2026-08-11T14:00:00.000Z', '2026-08-13T14:00:00.000Z')],
    })

    await waitFor(() =>
      expect(lastContextOn(12)).toMatchObject({
        isEnd: false,
        isStart: false,
      }),
    )
  },
}
