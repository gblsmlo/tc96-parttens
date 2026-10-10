import { afterEach, expect, test } from 'bun:test'

await import('../test/dom')
const { cleanup, render, screen } = await import('@testing-library/react')
const { ListView } = await import('../views/list/components/list-view')
const { CollectionProvider } = await import('../store/collection-provider')
const { CollectionViewOutlet } = await import('./collection-view-outlet')
afterEach(cleanup)

const collection = {
  items: [{ id: 'ignored', title: 'Ignored source item' }],
  getKey: (item: { id: string }) => item.id,
  getLabel: (item: { title: string }) => item.title,
  groupings: [],
}
const groups = [
  {
    id: 'stable-id',
    grouping: 'external',
    value: 'external',
    label: 'Prepared group',
    count: 900,
    items: [{ id: 'prepared', title: 'Prepared item' }],
  },
  {
    id: 'empty-id',
    grouping: 'external',
    value: null,
    label: 'Empty prepared group',
    count: 0,
    items: [],
  },
]

test('ListView uses prepared groups and preserves consumer counts without projecting data', () => {
  render(
    <ListView
      collection={collection}
      grouping="undeclared"
      groups={groups}
      renderItem={(item) => <span>{item.title}</span>}
    />,
  )
  expect(screen.getByText('Prepared item')).toBeDefined()
  expect(screen.getByText('900')).toBeDefined()
  expect(screen.getByText('Empty prepared group')).toBeDefined()
  expect(screen.queryByText('Ignored source item')).toBeNull()
})

test('an explicit empty group list never falls back to source data', () => {
  render(
    <ListView
      collection={collection}
      grouping={null}
      groups={[]}
      renderItem={(item) => <span>{item.title}</span>}
    />,
  )
  expect(screen.queryByText('Ignored source item')).toBeNull()
})

test('the outlet forwards prepared groups in list mode', () => {
  render(
    <CollectionProvider
      collection={collection}
      preferences={{ groupBy: null, view: 'list' }}
    >
      <CollectionViewOutlet
        collection={collection}
        groups={groups}
        renderListItem={(item) => <span>{item.title}</span>}
        renderKanbanItem={(item) => <span>{item.title}</span>}
      />
    </CollectionProvider>,
  )
  expect(screen.getByText('Prepared item')).toBeDefined()
  expect(screen.queryByText('Ignored source item')).toBeNull()
})

test('the outlet uses prepared groups in kanban mode without a grouping definition', () => {
  render(
    <CollectionProvider
      collection={collection}
      preferences={{ groupBy: null, view: 'kanban' }}
    >
      <CollectionViewOutlet
        collection={collection}
        groups={groups}
        renderListItem={(item) => <span>{item.title}</span>}
        renderKanbanItem={(item) => <span>{item.title}</span>}
      />
    </CollectionProvider>,
  )
  expect(screen.getAllByText('Prepared item').length).toBeGreaterThan(0)
  expect(screen.queryByText('Ignored source item')).toBeNull()
})

test('the outlet forwards list.emptyMessage for an empty ungrouped list', () => {
  const emptyCollection = {
    ...collection,
    items: [] as { id: string; title: string }[],
  }

  render(
    <CollectionProvider
      collection={emptyCollection}
      preferences={{ groupBy: null, view: 'list' }}
    >
      <CollectionViewOutlet
        collection={emptyCollection}
        list={{ emptyMessage: 'Nothing here yet.' }}
        renderListItem={(item) => <span>{item.title}</span>}
        renderKanbanItem={(item) => <span>{item.title}</span>}
      />
    </CollectionProvider>,
  )
  expect(screen.getByText('Nothing here yet.')).toBeDefined()
})
