import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

const { cleanup, render, screen } = await import('@testing-library/react')
const { GalleryView } = await import('./gallery-view')

afterEach(cleanup)

interface TestItem {
  id: string
  title: string
}

const collectionOf = (items: readonly TestItem[]) => ({
  getKey: (item: TestItem) => item.id,
  getLabel: (item: TestItem) => item.title,
  groupings: [],
  items,
})

const createRenderer = () => {
  const calls: string[] = []
  const renderItem = (item: TestItem) => {
    calls.push(item.id)
    return <article data-testid={`item-${item.id}`}>{item.title}</article>
  }

  return { calls, renderItem }
}

describe('GalleryView', () => {
  test('renders items in the collection order', () => {
    const { renderItem } = createRenderer()
    render(
      <GalleryView<TestItem>
        collection={collectionOf([
          { id: 'a', title: 'Alpha' },
          { id: 'b', title: 'Beta' },
          { id: 'c', title: 'Gamma' },
        ])}
        renderItem={renderItem}
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
    const { calls, renderItem } = createRenderer()
    const view = render(
      <GalleryView<TestItem> collection={collection} renderItem={renderItem} />,
    )

    expect(calls).toEqual(['a', 'b'])
    calls.length = 0
    view.rerender(
      <GalleryView<TestItem> collection={collection} renderItem={renderItem} />,
    )

    expect(calls).toEqual([])
  })

  test('renders the empty message when the collection has no items', () => {
    const { renderItem } = createRenderer()
    render(
      <GalleryView<TestItem>
        collection={collectionOf([])}
        emptyMessage="No documents found."
        renderItem={renderItem}
      />,
    )

    expect(screen.getByText('No documents found.')).toBeTruthy()
    expect(screen.queryByTestId(/^item-/)).toBeNull()
  })

  test('renders the requested skeleton count without calling the renderer', () => {
    const { calls, renderItem } = createRenderer()
    const { container } = render(
      <GalleryView<TestItem>
        collection={collectionOf([{ id: 'a', title: 'Alpha' }])}
        loading
        loadingItemCount={3}
        loadingItemLabel="Loading document"
        renderItem={renderItem}
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
