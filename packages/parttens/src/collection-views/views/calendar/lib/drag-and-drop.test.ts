import { describe, expect, test } from 'bun:test'

import {
  createCalendarItemDragId,
  parseCalendarItemDragId,
  resolveDayDrop,
  resolveTimeColumnDrop,
  snapToSlot,
} from './drag-and-drop'

const FORTALEZA = 'America/Fortaleza'
const NEW_YORK = 'America/New_York'

describe('calendar item drag ids', () => {
  test('round-trips an item key that contains separators', () => {
    const id = createCalendarItemDragId('task:1/2', '2026-08-12')

    expect(parseCalendarItemDragId(id)).toEqual({
      dateKey: '2026-08-12',
      itemKey: 'task:1/2',
    })
  })

  test('rejects a foreign id', () => {
    expect(parseCalendarItemDragId('kanban-card:x')).toBeNull()
  })
})

describe('resolveDayDrop', () => {
  test('changes the date preserving wall-clock time and duration', () => {
    const { end, start } = resolveDayDrop(
      {
        end: new Date('2026-08-12T18:00:00.000Z'),
        isAllDay: false,
        start: new Date('2026-08-12T17:00:00.000Z'),
      },
      { day: 20, month: 8, year: 2026 },
      FORTALEZA,
    )

    expect(start.toISOString()).toBe('2026-08-20T17:00:00.000Z')
    expect(end?.toISOString()).toBe('2026-08-20T18:00:00.000Z')
  })

  test('keeps a null end null', () => {
    const { end, start } = resolveDayDrop(
      {
        end: null,
        isAllDay: false,
        start: new Date('2026-08-12T12:00:00.000Z'),
      },
      { day: 13, month: 8, year: 2026 },
      FORTALEZA,
    )

    expect(start.toISOString()).toBe('2026-08-13T12:00:00.000Z')
    expect(end).toBeNull()
  })

  test('preserves absolute duration across a dst transition', () => {
    // Solto às 23:30 de parede na véspera da virada de NY, o compromisso de 3h
    // reais atravessa o salto de 02:00→03:00: o fim de parede vira 03:30 EDT.
    const { end, start } = resolveDayDrop(
      {
        end: new Date('2026-03-05T07:30:00.000Z'),
        isAllDay: false,
        start: new Date('2026-03-05T04:30:00.000Z'),
      },
      { day: 7, month: 3, year: 2026 },
      NEW_YORK,
    )

    expect(start.toISOString()).toBe('2026-03-08T04:30:00.000Z')
    expect(end?.toISOString()).toBe('2026-03-08T07:30:00.000Z')
  })
})

describe('snapToSlot', () => {
  test('rounds to the nearest slot', () => {
    expect(snapToSlot(0.5, 15)).toBe(720)
    expect(snapToSlot(0.51, 30)).toBe(720)
    expect(snapToSlot(0.53, 30)).toBe(750)
  })

  test('clamps to the bounds of the day', () => {
    expect(snapToSlot(-0.2, 15)).toBe(0)
    expect(snapToSlot(1.5, 15)).toBe(1440 - 15)
  })
})

describe('resolveTimeColumnDrop', () => {
  test('builds the new start from the target day and snapped minutes', () => {
    const { end, start } = resolveTimeColumnDrop(
      {
        end: new Date('2026-08-12T18:00:00.000Z'),
        isAllDay: false,
        start: new Date('2026-08-12T17:00:00.000Z'),
      },
      { day: 14, month: 8, year: 2026 },
      9 * 60 + 15,
      FORTALEZA,
    )

    expect(start.toISOString()).toBe('2026-08-14T12:15:00.000Z')
    expect(end?.toISOString()).toBe('2026-08-14T13:15:00.000Z')
  })
})
