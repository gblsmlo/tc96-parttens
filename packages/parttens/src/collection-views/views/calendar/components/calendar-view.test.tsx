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

const { act, cleanup, fireEvent, render, screen } = await import(
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

  const overflowDay = '2026-08-12'
  const overflowItems = ['a', 'b', 'c', 'd', 'e'].map((id, index) => ({
    end: null,
    id,
    start: `${overflowDay}T1${index}:00:00.000Z`,
    title: `Item ${id}`,
  }))
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0))
  const openOverflow = async (name: RegExp) => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name }))
      await settle()
    })
    return screen.getByRole('dialog', {
      name: 'quarta-feira, 12 de agosto de 2026',
    })
  }

  test('collapses the overflow behind a +N popover with the hidden items', async () => {
    const { container } = renderCalendar(overflowItems, {
      maxVisibleMonthItems: 3,
    })

    const cell = container.querySelector(
      `[data-calendar-date="${overflowDay}"]`,
    )
    expect(cell?.querySelectorAll('[data-calendar-item-id]')).toHaveLength(3)
    expect(
      screen.getByRole('button', { name: /^Mostrar mais 2 itens de/ })
        .textContent,
    ).toBe('+2')

    const popover = await openOverflow(/^Mostrar mais 2 itens de/)
    expect(
      Array.from(popover.querySelectorAll('[data-calendar-item-id]')).map(
        (item) => item.getAttribute('data-calendar-item-id'),
      ),
    ).toEqual(['d', 'e'])
    expect(
      screen.queryByRole('button', { name: /Mostrar todos os/ }),
    ).toBeNull()
  })

  test('reports the day from the popover title when onSelectDay is passed', async () => {
    let selectedDay: unknown = null
    renderCalendar(overflowItems.slice(0, 4), {
      maxVisibleMonthItems: 3,
      onSelectDay: (date) => {
        selectedDay = date
      },
    })

    await openOverflow(/^Mostrar mais 1 item de/)
    const title = screen.getByRole('button', {
      name: /^Mostrar todos os 4 itens de/,
    })
    expect(title.textContent).toBe('quarta-feira, 12 de agosto de 2026')
    await act(async () => {
      fireEvent.click(title)
      await settle()
    })
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

describe('CalendarView onSelectSlot', () => {
  const timedItem = {
    end: '2026-08-12T18:00:00.000Z',
    id: 'timed',
    start: '2026-08-12T17:00:00.000Z',
    title: 'Reunião',
  }

  const column = (container: HTMLElement, day: string) => {
    const element = container.querySelector<HTMLElement>(
      `[data-slot="calendar-time-grid"] [data-calendar-date="${day}"]`,
    )
    if (!element) throw new Error(`column ${day} not found`)
    element.getBoundingClientRect = () =>
      ({ height: 1440, top: 100 }) as DOMRect
    return element
  }

  const press = (target: Element, clientY: number) => {
    fireEvent.pointerDown(target, { clientY })
    fireEvent.click(target, { clientY })
  }

  test('reports the day and the snapped minutes of a click on an empty slot', () => {
    const slots: unknown[] = []
    const { container } = renderCalendar([timedItem], {
      mode: 'week',
      onSelectSlot: (slot) => slots.push(slot),
    })

    press(column(container, '2026-08-13'), 100 + 607)

    expect(slots).toEqual([
      {
        day: { day: 13, month: 8, year: 2026 },
        endMinutes: 615,
        startMinutes: 600,
      },
    ])
  })

  test('uses snapMinutes as the slot length', () => {
    const slots: unknown[] = []
    const { container } = renderCalendar([], {
      mode: 'day',
      onSelectSlot: (slot) => slots.push(slot),
      snapMinutes: 30,
    })

    press(column(container, '2026-08-12'), 100 + 610)

    expect(slots).toEqual([
      {
        day: { day: 12, month: 8, year: 2026 },
        endMinutes: 630,
        startMinutes: 600,
      },
    ])
  })

  test('ignores a click on an item', () => {
    const slots: unknown[] = []
    const { container } = renderCalendar([timedItem], {
      mode: 'day',
      onSelectSlot: (slot) => slots.push(slot),
    })
    const chip = container.querySelector('[data-calendar-item-id="timed"]')
    if (!chip) throw new Error('item not found')

    press(chip, 100 + 840)

    expect(slots).toEqual([])
  })

  test('ignores a click that did not start on the empty slot', () => {
    const slots: unknown[] = []
    const { container } = renderCalendar([timedItem], {
      mode: 'day',
      onSelectSlot: (slot) => slots.push(slot),
    })
    const target = column(container, '2026-08-12')
    const chip = container.querySelector('[data-calendar-item-id="timed"]')
    if (!chip) throw new Error('item not found')

    fireEvent.pointerDown(chip, { clientY: 100 + 840 })
    fireEvent.click(target, { clientY: 100 + 300 })

    expect(slots).toEqual([])
  })

  test('does not fire while loading nor in the month grid', () => {
    const slots: unknown[] = []
    const onSelectSlot = (slot: unknown) => slots.push(slot)
    const loading = renderCalendar([], {
      loading: true,
      mode: 'day',
      onSelectSlot,
    })
    press(column(loading.container, '2026-08-12'), 200)
    cleanup()

    const month = renderCalendar([], { mode: 'month', onSelectSlot })
    const cell = month.container.querySelector('[data-calendar-date]')
    if (!cell) throw new Error('cell not found')
    press(cell, 200)

    expect(slots).toEqual([])
  })

  test('adds no pointer affordance without the prop', () => {
    const { container } = renderCalendar([], { mode: 'day' })

    expect(column(container, '2026-08-12').className).not.toContain('cursor-')
  })
})
