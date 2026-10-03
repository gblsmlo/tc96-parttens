import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, {
  AbortController: window.AbortController,
  AbortSignal: window.AbortSignal,
  ResizeObserver: MockResizeObserver,
})

const { cleanup, render } = await import('@testing-library/react')
const { CalendarView } = await import('./calendar-view')
const { CalendarEventChip, CalendarEventChipTitle } = await import(
  './calendar-event-chip'
)

afterEach(cleanup)

interface FixtureItem {
  end: string | null
  id: string
  start: string
  title: string
}

type Contexts = import('../types').CalendarItemRenderContext

const FORTALEZA = 'America/Fortaleza'
const ANCHOR = new Date('2026-08-12T12:00:00.000Z')
const NOW = new Date('2026-08-12T15:00:00.000Z')

const at = (id: string, start: string, end: string | null = null) => ({
  end,
  id,
  start,
  title: `Item ${id}`,
})

const baseItems = () => [
  at('a', '2026-08-12T14:00:00.000Z', '2026-08-12T15:00:00.000Z'),
  at('b', '2026-08-13T14:00:00.000Z', '2026-08-13T15:00:00.000Z'),
  at('c', '2026-08-14T14:00:00.000Z', '2026-08-14T15:00:00.000Z'),
]

const getKey = (item: FixtureItem) => item.id
const getLabel = (item: FixtureItem) => item.title
const scheduleOf = (item: FixtureItem) => ({
  end: item.end ? new Date(item.end) : null,
  isAllDay: false,
  start: new Date(item.start),
})

function createRecorder() {
  const calls: { context: Contexts; id: string }[] = []
  const renderItem = (item: FixtureItem, context: Contexts) => {
    calls.push({ context, id: item.id })
    return (
      <CalendarEventChip>
        <CalendarEventChipTitle>{item.title}</CalendarEventChipTitle>
      </CalendarEventChip>
    )
  }
  const idsSince = (from: number) => calls.slice(from).map((call) => call.id)

  return { calls, idsSince, renderItem }
}

type Props = Parameters<typeof CalendarView<FixtureItem>>[0]

const viewOf = (
  items: FixtureItem[],
  props: Partial<Props> & Pick<Props, 'renderItem'>,
) => (
  <CalendarView<FixtureItem>
    anchor={ANCHOR}
    collection={{ getKey, getLabel, groupings: [], items }}
    getItemSchedule={scheduleOf}
    mode="month"
    now={NOW}
    timeZone={FORTALEZA}
    {...props}
  />
)

const cellOf = (container: HTMLElement, itemId: string) =>
  container
    .querySelector(`[data-calendar-item-id="${itemId}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

describe('CalendarView renderer contract', () => {
  test('a new renderItem identity re-renders every segment', () => {
    const recorder = createRecorder()
    const items = baseItems()
    const { rerender } = render(
      viewOf(items, { renderItem: recorder.renderItem }),
    )
    const before = recorder.calls.length

    rerender(
      viewOf(items, {
        renderItem: (item, context) => recorder.renderItem(item, context),
      }),
    )

    expect(recorder.idsSince(before).sort()).toEqual(['a', 'b', 'c'])
  })

  test('the same props re-render nothing', () => {
    const recorder = createRecorder()
    const items = baseItems()
    const { rerender } = render(
      viewOf(items, { renderItem: recorder.renderItem }),
    )
    const before = recorder.calls.length

    rerender(viewOf(items, { renderItem: recorder.renderItem }))

    expect(recorder.idsSince(before)).toEqual([])
  })

  test('replacing one item object re-renders only that item', () => {
    const recorder = createRecorder()
    const items = baseItems()
    const { rerender } = render(
      viewOf(items, { renderItem: recorder.renderItem }),
    )
    const before = recorder.calls.length

    rerender(
      viewOf(
        [
          items[0] as FixtureItem,
          { ...(items[1] as FixtureItem) },
          items[2] as FixtureItem,
        ],
        {
          renderItem: recorder.renderItem,
        },
      ),
    )

    expect(recorder.idsSince(before)).toEqual(['b'])
  })

  test('changed minutes on the same day re-render with the new context', () => {
    const recorder = createRecorder()
    const items = baseItems()
    const shifted = new Map<string, number>()
    const getItemSchedule = (item: FixtureItem) => {
      const schedule = scheduleOf(item)
      const offset = shifted.get(item.id) ?? 0
      return {
        ...schedule,
        end: schedule.end ? new Date(schedule.end.getTime() + offset) : null,
        start: new Date(schedule.start.getTime() + offset),
      }
    }
    const { rerender } = render(
      viewOf(items, {
        getItemSchedule,
        mode: 'week',
        renderItem: recorder.renderItem,
      }),
    )
    const before = recorder.calls.length
    shifted.set('a', 2 * 60 * 60 * 1000)

    rerender(
      viewOf(items, {
        getItemSchedule: (item) => getItemSchedule(item),
        mode: 'week',
        renderItem: recorder.renderItem,
      }),
    )

    const rendered = recorder.calls.slice(before)
    const moved = rendered.filter((call) => call.id === 'a')
    expect(moved).toHaveLength(1)
    expect(moved[0]?.context.startMinutes).toBe(13 * 60)
    expect(moved[0]?.context.date).toEqual({ day: 12, month: 8, year: 2026 })
    expect(rendered.filter((call) => call.id !== 'a')).toHaveLength(0)
  })

  test('a prop-driven move lands in the new cell with the new date', () => {
    const recorder = createRecorder()
    const items = baseItems()
    const { container, rerender } = render(
      viewOf(items, { renderItem: recorder.renderItem }),
    )
    expect(cellOf(container, 'a')).toBe('2026-08-12')
    const before = recorder.calls.length

    rerender(
      viewOf(
        [
          at('a', '2026-08-20T14:00:00.000Z', '2026-08-20T15:00:00.000Z'),
          items[1] as FixtureItem,
          items[2] as FixtureItem,
        ],
        { renderItem: recorder.renderItem },
      ),
    )

    expect(cellOf(container, 'a')).toBe('2026-08-20')
    const moved = recorder.calls.slice(before).filter((c) => c.id === 'a')
    expect(moved.at(-1)?.context.date).toEqual({
      day: 20,
      month: 8,
      year: 2026,
    })
    expect(recorder.idsSince(before).filter((id) => id !== 'a')).toEqual([])
  })

  test('isStart and isEnd follow the segment across navigation', () => {
    const recorder = createRecorder()
    const spanning = at(
      'span',
      '2026-08-12T14:00:00.000Z',
      '2026-08-13T14:00:00.000Z',
    )
    const items = [spanning]
    const { rerender } = render(
      viewOf(items, { mode: 'day', renderItem: recorder.renderItem }),
    )
    const first = recorder.calls.at(-1)?.context
    expect(first?.isStart).toBe(true)
    expect(first?.isEnd).toBe(false)

    rerender(
      viewOf(items, {
        anchor: new Date('2026-08-13T12:00:00.000Z'),
        mode: 'day',
        renderItem: recorder.renderItem,
      }),
    )

    const second = recorder.calls.at(-1)?.context
    expect(second?.date).toEqual({ day: 13, month: 8, year: 2026 })
    expect(second?.isStart).toBe(false)
    expect(second?.isEnd).toBe(true)
  })

  test('the date follows navigation when the segment flags do not change', () => {
    const recorder = createRecorder()
    const items = [
      at('span', '2026-08-10T14:00:00.000Z', '2026-08-14T14:00:00.000Z'),
    ]
    const { rerender } = render(
      viewOf(items, {
        anchor: new Date('2026-08-11T12:00:00.000Z'),
        mode: 'day',
        renderItem: recorder.renderItem,
      }),
    )
    expect(recorder.calls.at(-1)?.context.date).toEqual({
      day: 11,
      month: 8,
      year: 2026,
    })

    rerender(
      viewOf(items, {
        anchor: new Date('2026-08-12T12:00:00.000Z'),
        mode: 'day',
        renderItem: recorder.renderItem,
      }),
    )

    const context = recorder.calls.at(-1)?.context
    expect(context?.date).toEqual({ day: 12, month: 8, year: 2026 })
    expect(context?.isStart).toBe(false)
    expect(context?.isEnd).toBe(false)
  })

  test('isEnd follows a schedule change that stays on the same day', () => {
    const recorder = createRecorder()
    const items = [
      at('span', '2026-08-12T14:00:00.000Z', '2026-08-13T14:00:00.000Z'),
    ]
    const onTwelfth = () =>
      recorder.calls.findLast((call) => call.context.date.day === 12)?.context
    const end = { current: '2026-08-13T14:00:00.000Z' }
    const getItemSchedule = (item: FixtureItem) => ({
      end: new Date(end.current),
      isAllDay: false,
      start: new Date(item.start),
    })
    const { rerender } = render(
      viewOf(items, { getItemSchedule, renderItem: recorder.renderItem }),
    )
    expect(onTwelfth()?.isEnd).toBe(false)
    end.current = '2026-08-12T15:00:00.000Z'

    rerender(
      viewOf(items, {
        getItemSchedule: (item) => getItemSchedule(item),
        renderItem: recorder.renderItem,
      }),
    )

    const context = onTwelfth()
    expect(context?.date).toEqual({ day: 12, month: 8, year: 2026 })
    expect(context?.isEnd).toBe(true)
    expect(context?.isStart).toBe(true)
  })

  test('isStart follows a schedule change that stays on the same day', () => {
    const recorder = createRecorder()
    const items = [
      at('span', '2026-08-12T14:00:00.000Z', '2026-08-13T14:00:00.000Z'),
    ]
    const start = { current: '2026-08-12T14:00:00.000Z' }
    const onTwelfth = () =>
      recorder.calls.findLast((call) => call.context.date.day === 12)?.context
    const getItemSchedule = (item: FixtureItem) => ({
      end: new Date(item.end ?? item.start),
      isAllDay: false,
      start: new Date(start.current),
    })
    const { rerender } = render(
      viewOf(items, { getItemSchedule, renderItem: recorder.renderItem }),
    )
    expect(onTwelfth()?.isStart).toBe(true)
    start.current = '2026-08-11T14:00:00.000Z'

    rerender(
      viewOf(items, {
        getItemSchedule: (item) => getItemSchedule(item),
        renderItem: recorder.renderItem,
      }),
    )

    expect(onTwelfth()?.isStart).toBe(false)
    expect(onTwelfth()?.isEnd).toBe(false)
  })
})
