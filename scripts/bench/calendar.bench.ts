// bench-harness v1 adapter for CalendarView (month and week time grid).
//
// The probe item that the reschedule scenario drags is not counted: the drag overlay re-renders it a
// variable number of times per drag, so `items` means "renders of every other item" (see the README).
//
//   bun scripts/bench/calendar.bench.ts --json scripts/bench/results/calendar.base.json
//   bun scripts/bench/calendar.bench.ts --compare scripts/bench/results/calendar.base.json --gate

import * as React from 'react'
import {
  createElement,
  type ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react'
import {
  countRenders,
  createBench,
  fire,
  type MountTools,
  seededRandom,
} from './bench-harness'

const { CalendarEventChip, CalendarEventChipTitle, CalendarView } =
  await import('../../packages/parttens/src/collection-views/views/calendar')

type Reschedule =
  import('../../packages/parttens/src/collection-views/views/calendar').CalendarItemReschedule<Item>
type Schedule =
  import('../../packages/parttens/src/collection-views/views/calendar').CalendarItemSchedule
type RenderContext =
  import('../../packages/parttens/src/collection-views/views/calendar').CalendarItemRenderContext

type Mode = 'month' | 'week'

interface Item {
  end: number | null
  id: string
  isAllDay: boolean
  start: number
  title: string
}

interface Handle {
  container: HTMLElement
}

const SEED = 96
const TIME_ZONE = 'America/Fortaleza'
const UTC_OFFSET_HOURS = 3
const HOUR = 3_600_000
const DAY = 24 * HOUR
const ANCHOR = new Date('2026-08-12T12:00:00.000Z')
const NOW = new Date('2026-08-12T15:00:00.000Z')
const MONTH_FIRST = Date.UTC(2026, 7, 1, UTC_OFFSET_HOURS)
const MONTH_DAYS = 31
const NEXT_MONTH_FIRST = Date.UTC(2026, 8, 1, UTC_OFFSET_HOURS)
const NEXT_MONTH_DAYS = 30
const WEEK_FIRST = Date.UTC(2026, 7, 9, UTC_OFFSET_HOURS)
const WEEK_DAYS = 7
const NEXT_MONTH_ANCHOR = new Date('2026-09-12T12:00:00.000Z')
const NEXT_WEEK_ANCHOR = new Date(ANCHOR.getTime() + WEEK_DAYS * DAY)
const PROBE_ID = 'probe'
const PROBE_START = Date.UTC(2026, 7, 12, UTC_OFFSET_HOURS, 30)
const PROBE_END = PROBE_START + HOUR

const originalError = console.error
console.error = (...args: unknown[]) => {
  if (String(args[0]).includes('Could not parse CSS stylesheet')) return
  originalError(...args)
}
const Document_ = globalThis.Document as typeof Document
const Element_ = globalThis.Element as typeof Element
;(
  Document_.prototype as unknown as { getAnimations?: () => unknown[] }
).getAnimations ??= () => []

const CELL = 10
const COLUMN_HEIGHT = 600
const FIRST_WEEK = Math.floor((MONTH_FIRST / DAY + 4) / 7)
const dayNumberOf = (dateKey: string) =>
  Date.parse(`${dateKey}T00:00:00Z`) / DAY

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
  const style = (element as HTMLElement).style
  const [x = 0, y = 0] = style
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

Element_.prototype.getBoundingClientRect = function getBoundingClientRect(
  this: Element,
) {
  if (this.hasAttribute('data-dnd-dragging')) return draggedRect(this)
  const cell = this.closest('[data-calendar-date]')
  const dateKey = cell?.getAttribute('data-calendar-date')
  const mode = this.closest('[data-calendar-mode]')?.getAttribute(
    'data-calendar-mode',
  )
  if (!cell || !dateKey || !mode) return layoutRect(0, 0, 1000, 700)
  const day = dayNumberOf(dateKey)
  const left = ((day + 4) % 7) * CELL
  if (mode === 'month') {
    const top = (Math.floor((day + 4) / 7) - FIRST_WEEK) * CELL
    return layoutRect(left, top, CELL, CELL)
  }
  return this === cell
    ? layoutRect(left, 0, CELL, COLUMN_HEIGHT)
    : layoutRect(left, 0, CELL, CELL)
}

const documentProto = Document_.prototype as unknown as {
  elementFromPoint?: (x: number, y: number) => Element | null
}
documentProto.elementFromPoint ??= function elementFromPoint(
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

function periodItems(
  random: () => number,
  count: number,
  first: number,
  days: number,
  prefix: string,
  allDay: boolean,
): Item[] {
  return Array.from({ length: count }, (_, index) => {
    const day = Math.floor(random() * days)
    const hour = 8 + Math.floor(random() * 12)
    const minutes = Math.floor(random() * 4) * 15
    const start = first + day * DAY + hour * HOUR + minutes * 60_000
    const isAllDay = allDay && random() < 0.05
    const duration = (1 + Math.floor(random() * 4)) * 30 * 60_000
    return {
      end: isAllDay ? null : start + duration,
      id: `${prefix}-${index}`,
      isAllDay,
      start: isAllDay ? first + day * DAY : start,
      title: `Item ${prefix}-${index}`,
    }
  })
}

function buildItems(mode: Mode, size: number): Item[] {
  const random = seededRandom(SEED)
  const [first, days, nextFirst, nextDays] =
    mode === 'month'
      ? [MONTH_FIRST, MONTH_DAYS, NEXT_MONTH_FIRST, NEXT_MONTH_DAYS]
      : [WEEK_FIRST, WEEK_DAYS, WEEK_FIRST + WEEK_DAYS * DAY, WEEK_DAYS]
  return [
    {
      end: PROBE_END,
      id: PROBE_ID,
      isAllDay: false,
      start: PROBE_START,
      title: 'Probe',
    },
    ...periodItems(random, size, first, days, 'a', mode === 'week'),
    ...periodItems(random, size, nextFirst, nextDays, 'b', mode === 'week'),
  ]
}

const getKey = (item: Item) => item.id
const getLabel = (item: Item) => item.title
const getItemSchedule = (item: Item): Schedule => ({
  end: item.end === null ? null : new Date(item.end),
  isAllDay: item.isAllDay,
  start: new Date(item.start),
})

const renderChip = (item: Item) =>
  createElement(
    CalendarEventChip,
    null,
    createElement(CalendarEventChipTitle, null, item.title),
  )

const renderOtherItems = countRenders<[Item, RenderContext], ReactElement>(
  renderChip,
  'items',
)

const renderItem = (item: Item, context: RenderContext): ReactElement =>
  item.id === PROBE_ID ? renderChip(item) : renderOtherItems(item, context)

interface WrapperProps {
  anchors: readonly [Date, Date]
  initialItems: Item[]
  mode: Mode
}

function Wrapper({ anchors, initialItems, mode }: WrapperProps) {
  const [items, setItems] = useState(initialItems)
  const [anchorIndex, setAnchorIndex] = useState(0)
  const [, setTick] = useState(0)
  const collection = useMemo(
    () => ({ getKey, getLabel, groupings: [], items }),
    [items],
  )
  const onItemReschedule = useCallback((change: Reschedule) => {
    setItems((current) =>
      current.map((item) =>
        item.id === change.itemKey
          ? {
              ...item,
              end: change.end === null ? null : change.end.getTime(),
              start: change.start.getTime(),
            }
          : item,
      ),
    )
    return true
  }, [])
  return createElement(
    'div',
    null,
    createElement(
      'button',
      {
        'data-bench': 'refresh',
        onClick: () => setTick((t) => t + 1),
        type: 'button',
      },
      'Refresh',
    ),
    createElement(
      'button',
      {
        'data-bench': 'next',
        onClick: () => setAnchorIndex(1),
        type: 'button',
      },
      'Next',
    ),
    createElement(
      'button',
      {
        'data-bench': 'prev',
        onClick: () => setAnchorIndex(0),
        type: 'button',
      },
      'Previous',
    ),
    createElement(CalendarView<Item>, {
      anchor: anchors[anchorIndex] ?? anchors[0],
      collection,
      getItemSchedule,
      mode,
      now: NOW,
      onItemReschedule,
      renderItem,
      timeZone: TIME_ZONE,
    }),
  )
}

const control = (handle: Handle, name: string) => {
  const element = handle.container.querySelector(`[data-bench="${name}"]`)
  if (!element) throw new Error(`control ${name} not found`)
  return element
}

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 20))

const probeDate = (handle: Handle) =>
  handle.container
    .querySelector(`[data-calendar-item-id="${PROBE_ID}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

const calendarCase = (mode: Mode, size: number) => ({
  id: `${mode} ${size}`,
  mount(container: HTMLElement, tools: MountTools): Handle {
    const anchors: readonly [Date, Date] =
      mode === 'month'
        ? [ANCHOR, NEXT_MONTH_ANCHOR]
        : [ANCHOR, NEXT_WEEK_ANCHOR]
    tools.render(
      createElement(Wrapper, {
        anchors,
        initialItems: buildItems(mode, size),
        mode,
      }),
    )
    return { container }
  },
})

const key = (code: string) => ({ code, key: code === 'Space' ? ' ' : code })

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

async function dragProbe(
  handle: Handle,
  direction: 'ArrowLeft' | 'ArrowRight',
) {
  const grip = handle.container.querySelector(
    `[data-calendar-item-id="${PROBE_ID}"] [data-calendar-item-drag-handle]`,
  ) as HTMLElement | null
  if (!grip) throw new Error('probe drag handle not found')
  const from = probeDate(handle)
  await outsideAct(async () => {
    grip.focus()
    fire.keyDown(grip, key('Space'))
    await settle()
    fire.keyDown(grip, key(direction))
    await settle()
    fire.keyDown(grip, key('Space'))
    for (
      let attempt = 0;
      attempt < 50 && probeDate(handle) === from;
      attempt++
    ) {
      await settle()
    }
    await settle()
    await settle()
  })
  const to = probeDate(handle)
  if (!from || !to || from === to) {
    throw new Error(`probe did not move (${from} -> ${to})`)
  }
}

const bench = createBench<Handle>({
  cases: [
    calendarCase('month', 100),
    calendarCase('month', 1000),
    calendarCase('week', 100),
    calendarCase('week', 1000),
  ],
  name: 'calendar view',
  scenarios: [
    {
      name: 'parent re-render',
      run: (handle) => fire.click(control(handle, 'refresh')),
    },
    {
      name: 'next period',
      run: async (handle) => {
        fire.click(control(handle, 'next'))
        await settle()
        fire.click(control(handle, 'prev'))
        await settle()
      },
    },
    {
      name: 'keyboard reschedule and back',
      commits: false,
      run: async (handle) => {
        await dragProbe(handle, 'ArrowRight')
        await dragProbe(handle, 'ArrowLeft')
      },
    },
  ],
  seed: SEED,
})

await bench.run()
