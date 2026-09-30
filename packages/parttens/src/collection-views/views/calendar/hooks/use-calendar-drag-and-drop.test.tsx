import { describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { act, renderHook } = await import('@testing-library/react')
const { useCalendarDragAndDrop } = await import('./use-calendar-drag-and-drop')
const { createCalendarItemDragId } = await import('../lib/drag-and-drop')

const FORTALEZA = 'America/Fortaleza'

interface FixtureItem {
  id: string
  start: string
}

const scheduleOf = (item: FixtureItem) => ({
  end: null,
  isAllDay: false,
  start: new Date(item.start),
})

interface FakeSuspension {
  aborted: boolean
  resumed: boolean
}

function fakeDragEndEvent(itemKey: string, targetDateKey: string) {
  const suspension: FakeSuspension = { aborted: false, resumed: false }
  const event = {
    canceled: false,
    operation: {
      position: { current: { x: 0, y: 0 } },
      shape: null,
      source: {
        data: { dateKey: '2026-08-12', itemKey, type: 'item' },
        id: createCalendarItemDragId(itemKey, '2026-08-12'),
      },
      target: {
        data: { dateKey: targetDateKey, type: 'day' },
        element: null,
        id: `calendar-drop:day:${targetDateKey}:x`,
      },
    },
    suspend: () => ({
      abort: () => {
        suspension.aborted = true
      },
      resume: () => {
        suspension.resumed = true
      },
    }),
  }

  // O hook só lê os campos acima; o resto do DragEndEvent real não participa.
  return { event: event as never, suspension }
}

function setup(
  onItemReschedule?: (change: unknown) => boolean | Promise<boolean>,
) {
  const items: FixtureItem[] = [
    { id: 'task-1', start: '2026-08-12T17:00:00.000Z' },
  ]

  return renderHook(
    (props: { items: FixtureItem[] }) =>
      useCalendarDragAndDrop<FixtureItem>({
        getItemSchedule: scheduleOf,
        getKey: (item) => item.id,
        items: props.items,
        snapMinutes: 15,
        timeZone: FORTALEZA,
        ...(onItemReschedule ? { onItemReschedule } : {}),
      }),
    { initialProps: { items } },
  )
}

describe('useCalendarDragAndDrop', () => {
  test('is disabled without an onItemReschedule callback', () => {
    const { result } = setup()

    expect(result.current.dragEnabled).toBe(false)
  })

  test('applies the optimistic override while the promise settles and confirms on prop update', async () => {
    let resolveMutation = (_accepted: boolean) => {}
    const { rerender, result } = setup(
      () =>
        new Promise<boolean>((resolve) => {
          resolveMutation = resolve
        }),
    )
    const { event, suspension } = fakeDragEndEvent('task-1', '2026-08-20')

    act(() => result.current.handleDragEnd(event))

    const optimistic = result.current.resolveSchedule({
      id: 'task-1',
      start: '2026-08-12T17:00:00.000Z',
    })
    expect(optimistic?.start.toISOString()).toBe('2026-08-20T17:00:00.000Z')
    // Promise pendente: o drop nativo termina agora, sem segurar a suspensão.
    expect(suspension.resumed).toBe(true)

    await act(async () => {
      resolveMutation(true)
      await Promise.resolve()
    })

    // O dado confirmado chega pelo prop e o override sai de cena.
    act(() => {
      rerender({ items: [{ id: 'task-1', start: '2026-08-20T17:00:00.000Z' }] })
    })
    const confirmed = result.current.resolveSchedule({
      id: 'task-1',
      start: '2026-08-20T17:00:00.000Z',
    })
    expect(confirmed?.start.toISOString()).toBe('2026-08-20T17:00:00.000Z')
  })

  test('rolls back when the callback resolves false', async () => {
    const { result } = setup(() => Promise.resolve(false))
    const { event } = fakeDragEndEvent('task-1', '2026-08-20')

    act(() => result.current.handleDragEnd(event))
    await act(async () => {
      await Promise.resolve()
    })

    const schedule = result.current.resolveSchedule({
      id: 'task-1',
      start: '2026-08-12T17:00:00.000Z',
    })
    expect(schedule?.start.toISOString()).toBe('2026-08-12T17:00:00.000Z')
  })

  test('rolls back and aborts the suspension when the callback throws synchronously', () => {
    const { result } = setup(() => {
      throw new Error('rejected')
    })
    const { event, suspension } = fakeDragEndEvent('task-1', '2026-08-20')

    act(() => result.current.handleDragEnd(event))

    const schedule = result.current.resolveSchedule({
      id: 'task-1',
      start: '2026-08-12T17:00:00.000Z',
    })
    expect(schedule?.start.toISOString()).toBe('2026-08-12T17:00:00.000Z')
    expect(suspension.aborted).toBe(true)
  })

  test('rolls back when the promise rejects', async () => {
    const { result } = setup(() => Promise.reject(new Error('network')))
    const { event } = fakeDragEndEvent('task-1', '2026-08-20')

    act(() => result.current.handleDragEnd(event))
    await act(async () => {
      await Promise.resolve()
    })

    const schedule = result.current.resolveSchedule({
      id: 'task-1',
      start: '2026-08-12T17:00:00.000Z',
    })
    expect(schedule?.start.toISOString()).toBe('2026-08-12T17:00:00.000Z')
  })

  test('ignores a canceled drag', () => {
    let called = false
    const { result } = setup(() => {
      called = true
      return true
    })
    const { event } = fakeDragEndEvent('task-1', '2026-08-20')
    ;(event as { canceled: boolean }).canceled = true

    act(() => result.current.handleDragEnd(event))

    expect(called).toBe(false)
  })
})
