// bench-harness v1 — GalleryView adapter. Public API only; counts the consumer's renderItem.
//
//   bun scripts/bench/gallery.bench.ts --json scripts/bench/results/gallery.base.json
//   bun scripts/bench/gallery.bench.ts --compare scripts/bench/results/gallery.base.json --gate

import {
  countRenders,
  createBench,
  fire,
  type MountTools,
  seededRandom,
} from './bench-harness'

const { createElement, useState } = await import('react')
const { GalleryView } = await import(
  '../../packages/parttens/src/collection-views/views/gallery/index'
)

interface DocumentRecord {
  id: string
  note: string
  title: string
}

const SEED = 96

function buildCollection(size: number) {
  const random = seededRandom(SEED)
  const items: DocumentRecord[] = Array.from({ length: size }, (_, index) => ({
    id: `document-${index}`,
    note: `Note ${Math.floor(random() * 1e6)}`,
    title: `Document ${index}`,
  }))

  return {
    getKey: (item: DocumentRecord) => item.id,
    getLabel: (item: DocumentRecord) => item.title,
    groupings: [],
    items,
  }
}

const renderItem = countRenders(
  (item: DocumentRecord) =>
    createElement('article', null, item.title, item.note),
  'items',
)

type Collection = ReturnType<typeof buildCollection>

function Harness({ collection }: { collection: Collection }) {
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
    createElement(GalleryView<DocumentRecord>, { collection, renderItem }),
  )
}

interface Handle {
  container: HTMLElement
}

const galleryCase = (size: number) => ({
  id: `gallery ${size}`,
  mount(container: HTMLElement, tools: MountTools): Handle {
    tools.render(createElement(Harness, { collection: buildCollection(size) }))
    return { container }
  },
})

const query = (handle: Handle, selector: string) => {
  const element = handle.container.querySelector(selector)
  if (!element) throw new Error(`${selector} not found`)
  return element
}

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 50))

const bench = createBench<Handle>({
  cases: [galleryCase(100), galleryCase(1000)],
  name: 'GalleryView',
  scenarios: [
    {
      name: 'parent re-render',
      setup: () => settle(),
      run: (handle) => fire.click(query(handle, '[data-bench="refresh"]')),
    },
  ],
  seed: SEED,
})

await bench.run()
