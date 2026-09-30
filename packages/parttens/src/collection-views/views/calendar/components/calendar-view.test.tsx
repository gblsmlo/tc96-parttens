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

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { CalendarView } = await import('./calendar-view')
const { CalendarEventChip, CalendarEventChipTitle } = await import(
  './calendar-event-chip'
)

afterEach(cleanup)

interface FixtureItem {
  end: string | null
  id: string
  isAllDay?: boolean
  start: string
  title: string
}

const FORTALEZA = 'America/Fortaleza'
const ANCHOR = new Date('2026-08-12T12:00:00.000Z')
const NOW = new Date('2026-08-12T15:00:00.000Z')

const collectionOf = (items: FixtureItem[]) => ({
  getKey: (item: FixtureItem) => item.id,
  getLabel: (item: FixtureItem) => item.title,
  groupings: [],
  items,
})

const scheduleOf = (item: FixtureItem) => ({
  end: item.end ? new Date(item.end) : null,
  isAllDay: item.isAllDay ?? false,
  start: new Date(item.start),
})

const renderChip = (item: FixtureItem) => (
  <CalendarEventChip>
    <CalendarEventChipTitle>{item.title}</CalendarEventChipTitle>
  </CalendarEventChip>
)

function renderCalendar(
  items: FixtureItem[],
  props: Partial<Parameters<typeof CalendarView<FixtureItem>>[0]> = {},
) {
  return render(
    <CalendarView
      anchor={ANCHOR}
      collection={collectionOf(items)}
      getItemSchedule={scheduleOf}
      mode="month"
      now={NOW}
      renderItem={renderChip}
      timeZone={FORTALEZA}
      {...props}
    />,
  )
}

describe('CalendarView month', () => {
  test('places an item by its wall-clock day in the view time zone', () => {
    // 02:00 UTC do dia 29 ainda é 23:00 do dia 28 em Fortaleza (BUG-019).
    const { container } = renderCalendar([
      {
        end: null,
        id: 'late',
        start: '2026-08-29T02:00:00.000Z',
        title: 'Ligação tardia',
      },
    ])
    const cell = container.querySelector('[data-calendar-date="2026-08-28"]')

    expect(cell?.querySelector('[data-calendar-item-id="late"]')).not.toBeNull()
    expect(
      container.querySelector(
        '[data-calendar-date="2026-08-29"] [data-calendar-item-id]',
      ),
    ).toBeNull()
  })

  test('marks today and days outside the anchor month', () => {
    const { container } = renderCalendar([])

    expect(
      container
        .querySelector('[data-calendar-date="2026-08-12"]')
        ?.hasAttribute('data-today'),
    ).toBe(true)
    expect(
      container
        .querySelector('[data-calendar-date="2026-07-27"]')
        ?.hasAttribute('data-outside-month'),
    ).toBe(true)
  })

  test('shows the loading state with skeletons and aria-busy', () => {
    const { container } = renderCalendar([], {
      loading: true,
      loadingItemCount: 4,
      loadingItemLabel: 'Carregando compromisso',
    })

    expect(
      container
        .querySelector('[data-slot="calendar-view"]')
        ?.getAttribute('aria-busy'),
    ).toBe('true')
    expect(
      screen.getAllByRole('status', { name: 'Carregando compromisso' }),
    ).toHaveLength(4)
  })

  test('collapses the overflow behind a +N control that reports the day', () => {
    const day = '2026-08-12'
    const items = ['a', 'b', 'c', 'd', 'e'].map((id, index) => ({
      end: null,
      id,
      start: `${day}T1${index}:00:00.000Z`,
      title: `Item ${id}`,
    }))
    let selectedDay: unknown = null
    const { container } = renderCalendar(items, {
      maxVisibleMonthItems: 3,
      onSelectDay: (date) => {
        selectedDay = date
      },
    })

    const cell = container.querySelector(`[data-calendar-date="${day}"]`)
    expect(cell?.querySelectorAll('[data-calendar-item-id]')).toHaveLength(3)

    const overflow = screen.getByRole('button', {
      name: /Mostrar todos os 5 itens/,
    })
    expect(overflow.textContent).toBe('+2')
    fireEvent.click(overflow)
    expect(selectedDay).toEqual({ day: 12, month: 8, year: 2026 })
  })

  test('renders nothing draggable without an onItemReschedule callback', () => {
    const { container } = renderCalendar([
      {
        end: null,
        id: 'static',
        start: '2026-08-12T14:00:00.000Z',
        title: 'Sem arraste',
      },
    ])

    expect(container.querySelector('[data-calendar-item-draggable]')).toBeNull()
  })

  test('marks items draggable when rescheduling is wired', () => {
    const { container } = renderCalendar(
      [
        {
          end: null,
          id: 'movable',
          start: '2026-08-12T14:00:00.000Z',
          title: 'Com arraste',
        },
      ],
      { onItemReschedule: () => true },
    )

    expect(
      container.querySelector('[data-calendar-item-draggable]'),
    ).not.toBeNull()
  })
})

describe('CalendarView time grid', () => {
  test('separates all-day items into the strip and timed items into columns', () => {
    const { container } = renderCalendar(
      [
        {
          end: '2026-08-13T03:00:00.000Z',
          id: 'allday',
          isAllDay: true,
          start: '2026-08-12T03:00:00.000Z',
          title: 'Dia inteiro',
        },
        {
          end: '2026-08-12T18:00:00.000Z',
          id: 'timed',
          start: '2026-08-12T17:00:00.000Z',
          title: 'Reunião',
        },
      ],
      { mode: 'week' },
    )

    const strip = container.querySelector(
      '[data-calendar-all-day-date="2026-08-12"]',
    )
    const column = container.querySelector('[data-calendar-date="2026-08-12"]')

    expect(
      strip?.querySelector('[data-calendar-item-id="allday"]'),
    ).not.toBeNull()
    expect(strip?.querySelector('[data-calendar-item-id="timed"]')).toBeNull()
    expect(
      column?.querySelector('[data-calendar-item-id="timed"]'),
    ).not.toBeNull()
    expect(column?.querySelector('[data-calendar-item-id="allday"]')).toBeNull()
  })

  test('day mode renders a single day column', () => {
    const { container } = renderCalendar([], { mode: 'day' })

    expect(
      container.querySelectorAll('[data-slot="calendar-time-grid"] section'),
    ).toHaveLength(1)
    expect(
      container.querySelector('[data-calendar-date="2026-08-12"]'),
    ).not.toBeNull()
  })

  test('renders the now line only on the current day column', () => {
    const { container } = renderCalendar([], { mode: 'week' })
    const nowLines = container.querySelectorAll(
      '[data-slot="calendar-now-line"]',
    )

    expect(nowLines).toHaveLength(1)
    expect(
      container
        .querySelector('[data-calendar-date="2026-08-12"]')
        ?.querySelector('[data-slot="calendar-now-line"]'),
    ).not.toBeNull()
  })

  test('passes placement and minutes to renderItem in the time grid', () => {
    const contexts: unknown[] = []
    renderCalendar(
      [
        {
          end: '2026-08-12T18:00:00.000Z',
          id: 'timed',
          start: '2026-08-12T17:00:00.000Z',
          title: 'Reunião',
        },
      ],
      {
        mode: 'day',
        renderItem: (item, context) => {
          contexts.push(context)
          return renderChip(item)
        },
      },
    )

    expect(contexts).toContainEqual({
      date: { day: 12, month: 8, year: 2026 },
      endMinutes: 15 * 60,
      isEnd: true,
      isStart: true,
      placement: 'time-grid',
      startMinutes: 14 * 60,
    })
  })
})
