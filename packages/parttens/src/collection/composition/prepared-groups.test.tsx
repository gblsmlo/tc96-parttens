import { afterEach, expect, test } from 'bun:test'

await import('../test/dom')
const { cleanup, render, screen } = await import('@testing-library/react')
const { ListView } = await import('../layouts/list/components/list-view')
const { CollectionProvider } = await import('../store/collection-provider')
const { CollectionLayoutOutlet } = await import('./collection-layout-outlet')
afterEach(cleanup)

const collection = {
  records: [{ id: 'ignored', title: 'Ignored source item' }],
  getKey: (record: { id: string }) => record.id,
  getLabel: (record: { title: string }) => record.title,
  groupings: [],
}
const groups = [
  {
    id: 'stable-id',
    grouping: 'external',
    value: 'external',
    label: 'Prepared group',
    count: 900,
    records: [{ id: 'prepared', title: 'Prepared item' }],
  },
  {
    id: 'empty-id',
    grouping: 'external',
    value: null,
    label: 'Empty prepared group',
    count: 0,
    records: [],
  },
]

test('ListView uses prepared groups and preserves consumer counts without projecting data', () => {
  render(
    <ListView
      collection={collection}
      grouping="undeclared"
      groups={groups}
      renderRecord={(record) => <span>{record.title}</span>}
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
      renderRecord={(record) => <span>{record.title}</span>}
    />,
  )
  expect(screen.queryByText('Ignored source item')).toBeNull()
})

test('the outlet forwards prepared groups in list mode', () => {
  render(
    <CollectionProvider
      collection={collection}
      preferences={{ groupBy: null, layout: 'list' }}
    >
      <CollectionLayoutOutlet
        collection={collection}
        groups={groups}
        renderListRecord={(record) => <span>{record.title}</span>}
        renderKanbanRecord={(record) => <span>{record.title}</span>}
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
      preferences={{ groupBy: null, layout: 'kanban' }}
    >
      <CollectionLayoutOutlet
        collection={collection}
        groups={groups}
        renderListRecord={(record) => <span>{record.title}</span>}
        renderKanbanRecord={(record) => <span>{record.title}</span>}
      />
    </CollectionProvider>,
  )
  expect(screen.getAllByText('Prepared item').length).toBeGreaterThan(0)
  expect(screen.queryByText('Ignored source item')).toBeNull()
})

test('the outlet forwards list.emptyMessage for an empty ungrouped list', () => {
  const emptyCollection = {
    ...collection,
    records: [] as { id: string; title: string }[],
  }

  render(
    <CollectionProvider
      collection={emptyCollection}
      preferences={{ groupBy: null, layout: 'list' }}
    >
      <CollectionLayoutOutlet
        collection={emptyCollection}
        list={{ emptyMessage: 'Nothing here yet.' }}
        renderListRecord={(record) => <span>{record.title}</span>}
        renderKanbanRecord={(record) => <span>{record.title}</span>}
      />
    </CollectionProvider>,
  )
  expect(screen.getByText('Nothing here yet.')).toBeDefined()
})
