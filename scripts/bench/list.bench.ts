// bench-harness v1 — ListView adapter. Public API only; counts the consumer's renderItem.
//
//   bun scripts/bench/list.bench.ts --json scripts/bench/results/list.base.json
//   bun scripts/bench/list.bench.ts --compare scripts/bench/results/list.base.json --gate

import {
  countRenders,
  createBench,
  fire,
  type MountTools,
  seededRandom,
} from './bench-harness'

const { createElement, useState } = await import('react')
const { flushSync } = await import('react-dom')
const { ListItem, ListItemBody, ListItemDescription, ListItemTitle, ListView } =
  await import('../../packages/parttens/src/collection-views/views/list/index')

interface Task {
  id: string
  statusId: string
  title: string
  note: string
}

const SEED = 96
const GROUPS = 10
const statusOptions = Array.from({ length: GROUPS }, (_, index) => ({
  id: `s${index}`,
  label: `Status ${index}`,
}))

function buildCollection(size: number) {
  const random = seededRandom(SEED)
  const items: Task[] = Array.from({ length: size }, (_, index) => ({
    id: `task-${index}`,
    note: `Note ${Math.floor(random() * 1e6)}`,
    statusId: `s${index % GROUPS}`,
    title: `Task ${index}`,
  }))
  return {
    getKey: (item: Task) => item.id,
    getLabel: (item: Task) => item.title,
    groupings: [
      {
        getGroupId: (item: Task) => item.statusId,
        id: 'status',
        label: 'Status',
        options: statusOptions,
      },
    ],
    items,
  }
}

const renderItem = countRenders((item: Task) => {
  return createElement(
    ListItem,
    null,
    createElement(
      ListItemBody,
      null,
      createElement(ListItemTitle, null, item.title),
      createElement(ListItemDescription, null, item.note),
    ),
  )
}, 'items')

type Collection = ReturnType<typeof buildCollection>

function Harness({
  collection,
  grouped,
}: {
  collection: Collection
  grouped: boolean
}) {
  const [, setTick] = useState(0)
  return createElement(
    'div',
    null,
    createElement(
      'button',
      {
        'data-bench': 'refresh',
        onClick: () => setTick((tick) => tick + 1),
        type: 'button',
      },
      'Refresh',
    ),
    createElement(ListView<Task>, {
      collection,
      grouping: grouped ? 'status' : null,
      renderItem,
    }),
  )
}

interface Handle {
  container: HTMLElement
  grouped: boolean
}

const listCase = (size: number, grouped: boolean) => ({
  id: `list ${size}${grouped ? ' grouped' : ''}`,
  mount(container: HTMLElement, tools: MountTools): Handle {
    tools.render(
      createElement(Harness, { collection: buildCollection(size), grouped }),
    )
    return { container, grouped }
  },
})

const query = (handle: Handle, selector: string) => {
  const element = handle.container.querySelector(selector)
  if (!element) throw new Error(`${selector} not found`)
  return element
}

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 50))

const bench = createBench<Handle>({
  cases: [
    listCase(100, false),
    listCase(1000, false),
    listCase(100, true),
    listCase(1000, true),
  ],
  name: 'ListView',
  scenarios: [
    {
      name: 'parent re-render',
      setup: () => settle(),
      run: (handle) => fire.click(query(handle, '[data-bench="refresh"]')),
    },
    {
      cases: ['list 100 grouped', 'list 1000 grouped'],
      name: 'group collapse and expand',
      setup: () => settle(),
      run: (handle) => {
        flushSync(() =>
          fire.click(query(handle, '[aria-label="Collapse Status 0"]')),
        )
        flushSync(() =>
          fire.click(query(handle, '[aria-label="Expand Status 0"]')),
        )
      },
    },
  ],
  seed: SEED,
})

await bench.run()
