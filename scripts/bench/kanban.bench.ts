// bench-harness v1 adapter for KanbanView.
//
// Drag scenarios use dnd-kit's keyboard sensor outside act(), on cases without the profiler,
// and do not count the dragged card (see views/kanban/README.md).
//
//   bun scripts/bench/kanban.bench.ts --json scripts/bench/results/kanban.base.json
//   bun scripts/bench/kanban.bench.ts --compare scripts/bench/results/kanban.base.json --gate

import * as React from 'react'
import {
  createElement,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import {
  type BenchScenario,
  countRenders,
  createBench,
  fire,
  type MountTools,
  seededRandom,
} from './bench-harness'

const { flushSync } = await import('react-dom')
const { createRoot } = await import('react-dom/client')
type Root = ReturnType<typeof createRoot>
const { KanbanView } = await import(
  '../../packages/parttens/src/collection-views/views/kanban/index'
)

interface Card {
  id: string
  title: string
}

interface Column {
  cards: Card[]
  count: number
  id: string
  title: string
}

interface Move {
  card: Card
  sourceColumnId: string
  sourceIndex?: number
  targetColumnId: string
  targetIndex?: number
}

const SEED = 96
const COLLAPSIBLE_COLUMN = 'column-1'

function buildColumns(columnCount: number, cardsPerColumn: number): Column[] {
  const random = seededRandom(SEED)
  return Array.from({ length: columnCount }, (_, columnIndex) => ({
    cards: Array.from({ length: cardsPerColumn }, (_, cardIndex) => ({
      id: `c${columnIndex}-${cardIndex}`,
      title: `Card ${columnIndex}.${cardIndex} ${Math.floor(random() * 1e6)}`,
    })),
    count: cardsPerColumn,
    id: `column-${columnIndex}`,
    title: `Column ${columnIndex}`,
  }))
}

function applyMove(columns: Column[], move: Move): Column[] {
  const source = columns.find((column) => column.id === move.sourceColumnId)
  const sourceIndex = source?.cards.findIndex(
    (card) => card.id === move.card.id,
  )
  if (!source || sourceIndex === undefined || sourceIndex === -1) return columns
  return columns.map((column) => {
    let cards = column.cards
    if (column.id === move.sourceColumnId) {
      cards = cards.filter((card) => card.id !== move.card.id)
    }
    if (column.id === move.targetColumnId) {
      const next = [...cards]
      next.splice(move.targetIndex ?? next.length, 0, move.card)
      cards = next
    }
    return cards === column.cards
      ? column
      : { ...column, cards, count: cards.length }
  })
}

let draggedCardId: string | null = null

const renderOtherCards = countRenders<[Card], ReactNode>(
  (card) => createElement('span', null, card.title),
  'cards',
)

const renderCard = (card: Card): ReactNode =>
  card.id === draggedCardId
    ? createElement('span', null, card.title)
    : renderOtherCards(card)

const getKey = (card: Card) => card.id

function Board({ initial }: { initial: Column[] }) {
  const [columns, setColumns] = useState(initial)
  const [collapsed, setCollapsed] = useState(false)
  const [, setTick] = useState(0)
  const onMoveCard = useCallback((move: Move) => {
    setColumns((current) => applyMove(current, move))
    return true
  }, [])
  const shown = useMemo(
    () =>
      collapsed
        ? columns.map((column) =>
            column.id === COLLAPSIBLE_COLUMN
              ? { ...column, collapsed: true }
              : column,
          )
        : columns,
    [collapsed, columns],
  )
  return createElement(
    'div',
    null,
    createElement(
      'button',
      {
        'data-bench-refresh': '',
        onClick: () => setTick((t) => t + 1),
        type: 'button',
      },
      'Refresh',
    ),
    createElement(
      'button',
      {
        'data-bench-collapse': '',
        onClick: () => setCollapsed((value) => !value),
        type: 'button',
      },
      'Collapse',
    ),
    createElement(KanbanView<Card>, {
      columns: shown,
      getKey,
      onMoveCard,
      renderCard,
    }),
  )
}

const CELL = 100

function layoutRect(left: number, top: number, width: number, height: number) {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect
}

function installLayout() {
  const proto = Element.prototype as unknown as {
    getBoundingClientRect(this: Element): DOMRect
  }
  const observer = new MutationObserver(() => {})
  observer.observe(document.body, { childList: true, subtree: true })
  let rects = new WeakMap<Element, DOMRect>()
  const indexes = new Map<Element, Map<Element, number>>()
  const indexIn = (parent: Element, child: Element) => {
    let map = indexes.get(parent)
    if (!map) {
      map = new Map(Array.from(parent.children, (c, i) => [c, i] as const))
      indexes.set(parent, map)
    }
    return map.get(child) ?? 0
  }
  const compute = (element: Element): DOMRect => {
    const overlay = element.closest('[data-dnd-dragging], [data-dnd-overlay]')
    const source = overlay
      ? document.querySelector('[data-kanban-card-container].opacity-0')
      : null
    if (source && source !== element) return source.getBoundingClientRect()
    const column = element.closest('section[data-slot="kanban-column"]')
    if (!column) return layoutRect(0, 0, 100000, 100000)
    const board = column.parentElement
    const left = (board ? indexIn(board, column) : 0) * CELL
    const card = element.closest('[data-kanban-card-container]')
    if (!card) return layoutRect(left, 0, CELL, 1000 * CELL)
    const list = card.parentElement
    return layoutRect(left, (list ? indexIn(list, card) : 0) * CELL, CELL, CELL)
  }
  proto.getBoundingClientRect = function getBoundingClientRect(this: Element) {
    if (observer.takeRecords().length > 0) {
      rects = new WeakMap()
      indexes.clear()
    }
    if (this.closest('[data-dnd-dragging], [data-dnd-overlay]'))
      return compute(this)
    let rect = rects.get(this)
    if (!rect) {
      rect = compute(this)
      rects.set(this, rect)
    }
    return rect
  }
}

installLayout()
;(Element.prototype as unknown as { animate?: () => unknown }).animate ??=
  () => ({
    addEventListener() {},
    cancel() {},
    commitStyles() {},
    finish() {},
    finished: Promise.resolve(),
    removeEventListener() {},
  })
const originalError = console.error
console.error = (...args: unknown[]) => {
  const message = String(args[0])
  if (
    message.includes('Could not parse CSS stylesheet') ||
    message.includes('was not wrapped in act')
  )
    return
  originalError(...args)
}
;(
  Document.prototype as unknown as { getAnimations?: () => unknown[] }
).getAnimations ??= () => []

interface Handle {
  columns: number
  container: HTMLElement
  root?: Root
  size: number
}

const SMALL = '5 columns x 20 cards'
const LARGE = '10 columns x 100 cards'
const SMALL_DRAG = `${SMALL}, drag`
const LARGE_DRAG = `${LARGE}, drag`

const boardCase = (id: string, columns: number, cards: number) => ({
  id,
  mount(container: HTMLElement, tools: MountTools): Handle {
    tools.render(
      createElement(Board, { initial: buildColumns(columns, cards) }),
    )
    return { columns, container, size: cards }
  },
})

const dragBoardCase = (id: string, columns: number, cards: number) => ({
  id,
  mount(container: HTMLElement): Handle {
    const root = createRoot(container)
    root.render(createElement(Board, { initial: buildColumns(columns, cards) }))
    return { columns, container, root, size: cards }
  },
  unmount(handle: Handle) {
    flushSync(() => handle.root?.unmount())
  },
})

const handleOf = (handle: Handle, cardId: string) => {
  const element = handle.container.querySelector(
    `[data-kanban-card-drag-handle][data-kanban-card-drag-id="kanban-card:${cardId}"]`,
  )
  if (!element) throw new Error(`drag handle for ${cardId} not found`)
  return element as HTMLElement
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

const SETTLE_MS = 100
function quiet(ms: number) {
  return new Promise<void>((resolve) => {
    let timer = setTimeout(done, ms)
    const observer = new MutationObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(done, ms)
    })
    function done() {
      observer.disconnect()
      resolve()
    }
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    })
  })
}

async function waitFor(
  what: string,
  condition: () => boolean,
  optional = false,
  timeoutMs = 120000,
) {
  const deadline = performance.now() + timeoutMs
  while (!condition()) {
    if (performance.now() > deadline) {
      if (optional) return
      console.error(
        'DBGSTATE',
        what,
        document.querySelectorAll('[data-dnd-dragging]').length,
        document.querySelectorAll('[data-kanban-card-container].opacity-0')
          .length,
        document.querySelector('[data-dnd-dragging]')?.outerHTML.slice(0, 200),
      )
      throw new Error(`timed out: ${what}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 2))
  }
}

const locate = (handle: Handle, cardId: string) => {
  const container = handleOf(handle, cardId).closest(
    '[data-kanban-card-container]',
  )
  const column = container?.closest('section[data-slot="kanban-column"]')
  if (!container?.parentElement || !column?.parentElement)
    throw new Error(`card ${cardId} is not on the board`)
  return `${Array.from(column.parentElement.children).indexOf(column)}:${Array.from(container.parentElement.children).indexOf(container)}`
}

const isDragIdle = () =>
  !document.querySelector('[data-dnd-dragging]') &&
  !document.querySelector('[data-kanban-card-container].opacity-0')

async function drag(handle: Handle, cardId: string, arrow: string) {
  await outsideAct(async () => {
    const before = locate(handle, cardId)
    draggedCardId = cardId
    const grip = handleOf(handle, cardId)
    grip.focus()
    fire.keyDown(grip, { code: 'Space', key: ' ' })
    await quiet(SETTLE_MS)
    fire.keyDown(grip, { code: arrow, key: arrow })
    await waitFor('card moved', () => locate(handle, cardId) !== before)
    await quiet(SETTLE_MS)
    fire.keyDown(handleOf(handle, cardId), { code: 'Space', key: ' ' })
    await waitFor('drag end', isDragIdle)
    if (locate(handle, cardId).split(':')[0] !== before.split(':')[0]) {
      await waitFor(
        'focus restored',
        () => document.activeElement === handleOf(handle, cardId),
      )
    }
    await quiet(SETTLE_MS * 3)
    draggedCardId = null
  })
}

const press = (handle: Handle, selector: string) => {
  const button = handle.container.querySelector(selector)
  if (!button) throw new Error(`${selector} not found`)
  flushSync(() => fire.click(button))
}

const selectColumn = (handle: Handle, title: string) => {
  const button = Array.from(
    handle.container.querySelectorAll('button[aria-pressed]'),
  ).find((element) => element.textContent?.startsWith(`${title} `))
  if (!button) throw new Error(`selector for ${title} not found`)
  flushSync(() => fire.click(button))
}

const dragIterations = Math.min(Number(process.env.BENCH_ITERATIONS ?? 5), 3)

const dragScenario = (
  name: string,
  forward: string,
  backward: string,
): BenchScenario<Handle>[] => {
  const run = async (handle: Handle) => {
    await drag(handle, 'c0-0', forward)
    await drag(handle, 'c0-0', backward)
  }
  return [
    { cases: [SMALL_DRAG], name, run },
    { cases: [LARGE_DRAG], iterations: dragIterations, name, run, warmup: 0 },
  ]
}

const profiledCases = [SMALL, LARGE]

const bench = createBench<Handle>({
  cases: [
    boardCase(SMALL, 5, 20),
    boardCase(LARGE, 10, 100),
    dragBoardCase(SMALL_DRAG, 5, 20),
    dragBoardCase(LARGE_DRAG, 10, 100),
  ],
  mount: { cases: profiledCases },
  name: 'kanban view',
  scenarios: [
    {
      cases: profiledCases,
      name: 'parent re-render',
      run: (handle) => press(handle, '[data-bench-refresh]'),
    },
    {
      cases: profiledCases,
      name: 'collapse and expand column',
      run: (handle) => {
        press(handle, '[data-bench-collapse]')
        press(handle, '[data-bench-collapse]')
      },
    },
    {
      cases: profiledCases,
      name: 'switch mobile column',
      run: (handle) => {
        selectColumn(handle, 'Column 1')
        selectColumn(handle, 'Column 0')
      },
    },
    ...dragScenario('drag right and back', 'ArrowRight', 'ArrowLeft'),
    ...dragScenario('reorder down and back', 'ArrowDown', 'ArrowUp'),
  ],
  seed: SEED,
})

await bench.run()
