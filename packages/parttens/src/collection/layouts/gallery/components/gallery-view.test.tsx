import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { GalleryView } = await import('./gallery-view')

afterEach(cleanup)

interface TestRecord {
  id: string
  title: string
}

const collectionOf = (records: readonly TestRecord[]) => ({
  getKey: (record: TestRecord) => record.id,
  getLabel: (record: TestRecord) => record.title,
  groupings: [],
  records,
})

const createRenderer = () => {
  const calls: string[] = []
  const renderRecord = (record: TestRecord) => {
    calls.push(record.id)
    return <article data-testid={`item-${record.id}`}>{record.title}</article>
  }

  return { calls, renderRecord }
}

describe('GalleryView', () => {
  test('renders items in the collection order', () => {
    const { renderRecord } = createRenderer()
    render(
      <GalleryView<TestRecord>
        collection={collectionOf([
          { id: 'a', title: 'Alpha' },
          { id: 'b', title: 'Beta' },
          { id: 'c', title: 'Gamma' },
        ])}
        renderRecord={renderRecord}
      />,
    )

    expect(
      screen.getAllByTestId(/^item-/).map((node) => node.textContent),
    ).toEqual(['Alpha', 'Beta', 'Gamma'])
  })

  test('does not rerun stable item renderers on a parent rerender', () => {
    const collection = collectionOf([
      { id: 'a', title: 'Alpha' },
      { id: 'b', title: 'Beta' },
    ])
    const { calls, renderRecord } = createRenderer()
    const view = render(
      <GalleryView<TestRecord>
        collection={collection}
        renderRecord={renderRecord}
      />,
    )

    expect(calls).toEqual(['a', 'b'])
    calls.length = 0
    view.rerender(
      <GalleryView<TestRecord>
        collection={collection}
        renderRecord={renderRecord}
      />,
    )

    expect(calls).toEqual([])
  })

  test('renders the empty message when the collection has no items', () => {
    const { renderRecord } = createRenderer()
    render(
      <GalleryView<TestRecord>
        collection={collectionOf([])}
        emptyMessage="No documents found."
        renderRecord={renderRecord}
      />,
    )

    expect(screen.getByText('No documents found.')).toBeTruthy()
    expect(screen.queryByTestId(/^item-/)).toBeNull()
  })

  test('renders the requested skeleton count without calling the renderer', () => {
    const { calls, renderRecord } = createRenderer()
    const { container } = render(
      <GalleryView<TestRecord>
        collection={collectionOf([{ id: 'a', title: 'Alpha' }])}
        loading
        loadingRecordCount={3}
        loadingRecordLabel="Loading document"
        renderRecord={renderRecord}
      />,
    )

    expect(
      container
        .querySelector('[data-slot="gallery-view"]')
        ?.getAttribute('aria-busy'),
    ).toBe('true')
    expect(
      screen.getAllByRole('status', { name: 'Loading document' }),
    ).toHaveLength(3)
    expect(calls).toEqual([])
    expect(screen.queryByText('No items to show.')).toBeNull()
  })
})
