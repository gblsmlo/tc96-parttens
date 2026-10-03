import { afterEach, describe, expect, test } from 'bun:test'
import * as React from 'react'

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

const { cleanup, fireEvent, render } = await import('@testing-library/react')
const { CalendarView } = await import('./calendar-view')

afterEach(cleanup)

interface FixtureItem {
  id: string
  start: number
}

type RenderContext = import('../types').CalendarItemRenderContext
type Reschedule = import('../types').CalendarItemReschedule<FixtureItem>

const FORTALEZA = 'America/Fortaleza'
const ANCHOR = new Date('2026-08-12T12:00:00.000Z')
const NOW = new Date('2026-08-12T15:00:00.000Z')
const DAY = 24 * 3_600_000
const START = Date.UTC(2026, 7, 12, 14)
const CELL = 10
const FIRST_WEEK = Math.floor((Date.UTC(2026, 7, 1) / DAY + 4) / 7)

const layoutRect = (left: number, top: number, width: number, height: number) =>
  ({
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  }) as DOMRect

const cssNumber = (element: Element, name: string) =>
  Number.parseFloat(
    (element as HTMLElement).style.getPropertyValue(name).split(' ')[0] ?? '',
  ) || 0

const draggedRect = (element: Element) => {
  const [x = 0, y = 0] = (element as HTMLElement).style
    .getPropertyValue('--dnd-translate')
    .split(' ')
    .map((part) => Number.parseFloat(part) || 0)
  return layoutRect(
    cssNumber(element, '--dnd-left') + x,
    cssNumber(element, '--dnd-top') + y,
    cssNumber(element, '--dnd-width'),
    cssNumber(element, '--dnd-height'),
  )
}

const ElementCtor = globalThis.Element as typeof Element
const DocumentCtor = globalThis.Document as typeof Document

ElementCtor.prototype.getBoundingClientRect = function getBoundingClientRect(
  this: Element,
) {
  if (this.hasAttribute('data-dnd-dragging')) return draggedRect(this)
  const cell = this.closest('[data-calendar-date]')
  const dateKey = cell?.getAttribute('data-calendar-date')
  if (!cell || !dateKey) return layoutRect(0, 0, 1000, 700)
  const day = Date.parse(`${dateKey}T00:00:00Z`) / DAY
  const top = (Math.floor((day + 4) / 7) - FIRST_WEEK) * CELL
  return layoutRect(((day + 4) % 7) * CELL, top, CELL, CELL)
}

const documentProto = DocumentCtor.prototype as unknown as {
  elementFromPoint?: (x: number, y: number) => Element | null
}
documentProto.elementFromPoint = function elementFromPoint(
  this: Document,
  x: number,
  y: number,
) {
  const cells = Array.from(this.querySelectorAll('[data-calendar-date]'))
  return (
    cells.reverse().find((cell) => {
      const rect = cell.getBoundingClientRect()
      return (
        x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom
      )
    }) ?? null
  )
}

const reactInternals = (
  React as unknown as {
    __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: {
      actQueue: unknown[] | null
    }
  }
).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE

async function outsideAct(work: () => Promise<void>) {
  const flags = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  const queue = reactInternals.actQueue
  reactInternals.actQueue = null
  flags.IS_REACT_ACT_ENVIRONMENT = false
  try {
    await work()
  } finally {
    flags.IS_REACT_ACT_ENVIRONMENT = true
    reactInternals.actQueue = queue
  }
}

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 20))
const key = (code: string) => ({ code, key: code === 'Space' ? ' ' : code })

const itemOf = (id: string, offsetDays = 0): FixtureItem => ({
  id,
  start: START + offsetDays * DAY,
})
const initialItems = () => [
  itemOf('moved'),
  itemOf('other-1', 1),
  itemOf('other-2', 2),
]

const getKey = (item: FixtureItem) => item.id
const getLabel = (item: FixtureItem) => item.id
const scheduleOf = (item: FixtureItem) => ({
  end: new Date(item.start + 3_600_000),
  isAllDay: false,
  start: new Date(item.start),
})

function Tag({ id, log }: { id: string; log: Log }) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  React.useLayoutEffect(() => {
    log.push({
      id,
      inGrid: ref.current?.closest('[data-calendar-date]') != null,
    })
  })
  return <span ref={ref}>{id}</span>
}

type Log = { id: string; inGrid: boolean }[]

function setup(
  onItemReschedule: (change: Reschedule) => boolean | Promise<boolean>,
  getItemSchedule: (
    item: FixtureItem,
  ) => ReturnType<typeof scheduleOf> = scheduleOf,
) {
  const log: Log = []
  const renderItem = (item: FixtureItem, _context: RenderContext) => (
    <Tag id={item.id} log={log} />
  )
  const element = (
    items: FixtureItem[],
    schedule: typeof getItemSchedule = getItemSchedule,
  ) => (
    <CalendarView<FixtureItem>
      anchor={ANCHOR}
      collection={{ getKey, getLabel, groupings: [], items }}
      getItemSchedule={schedule}
      mode="month"
      now={NOW}
      onItemReschedule={onItemReschedule}
      renderItem={renderItem}
      timeZone={FORTALEZA}
    />
  )
  const view = render(element(initialItems()))
  return { ...view, element, log }
}

const cellOf = (container: HTMLElement, id: string) =>
  container
    .querySelector(`[data-calendar-item-id="${id}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

async function dragRight(container: HTMLElement) {
  const grip = container.querySelector(
    '[data-calendar-item-id="moved"] [data-calendar-item-drag-handle]',
  ) as HTMLElement
  await outsideAct(async () => {
    grip.focus()
    fireEvent.keyDown(grip, key('Space'))
    await settle()
    fireEvent.keyDown(grip, key('ArrowRight'))
    await settle()
    fireEvent.keyDown(grip, key('Space'))
    await settle()
    await settle()
    await settle()
  })
}

const gridRenders = (log: Log, id: string) =>
  log.filter((entry) => entry.id === id && entry.inGrid).length

describe('CalendarView drag renders', () => {
  test('an accepted drag renders the moved item at most twice and the others never', async () => {
    const { container, log } = setup(() => true)
    const afterMount = log.length
    expect(afterMount).toBe(3)

    await dragRight(container)

    expect(cellOf(container, 'moved')).toBe('2026-08-13')
    const since = log.slice(afterMount)
    expect(gridRenders(since, 'moved')).toBeLessThanOrEqual(2)
    expect(since.filter((entry) => entry.id !== 'moved')).toHaveLength(0)
  })

  test('a rejected move returns the item to the source cell', async () => {
    const { container, log } = setup(() => false)
    const afterMount = log.length

    await dragRight(container)

    expect(cellOf(container, 'moved')).toBe('2026-08-12')
    expect(
      log.slice(afterMount).filter((entry) => entry.id !== 'moved'),
    ).toHaveLength(0)
  })

  test('a rejected promise returns the item to the source cell', async () => {
    const { container } = setup(() => Promise.reject(new Error('network')))

    await dragRight(container)

    expect(cellOf(container, 'moved')).toBe('2026-08-12')
  })

  test('confirming through props clears the override without rendering', async () => {
    const confirmed = new Set<string>()
    const getItemSchedule = (item: FixtureItem) => {
      const schedule = scheduleOf(item)
      return confirmed.has(item.id)
        ? {
            ...schedule,
            end: new Date(schedule.end.getTime() + DAY),
            start: new Date(schedule.start.getTime() + DAY),
          }
        : schedule
    }
    const { container, element, log, rerender } = setup(
      () => true,
      getItemSchedule,
    )
    const items = initialItems()
    rerender(element(items))
    await dragRight(container)
    expect(cellOf(container, 'moved')).toBe('2026-08-13')
    const before = log.length
    confirmed.add('moved')

    rerender(element(items, (item) => getItemSchedule(item)))

    expect(cellOf(container, 'moved')).toBe('2026-08-13')
    expect(log.length - before).toBe(0)
  })
})
