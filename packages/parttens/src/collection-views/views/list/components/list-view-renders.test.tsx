import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactNode } from 'react'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ListView } = await import('./list-view')

afterEach(cleanup)

type TestItem = {
  id: string
  statusId: string
  title: string
}

const groupings = [
  {
    getGroupId: (item: TestItem) => item.statusId,
    id: 'status',
    label: 'Status',
    options: [
      { id: 'todo', label: 'Todo' },
      { id: 'done', label: 'Done' },
    ],
  },
]

const todoA: TestItem = { id: 'a', statusId: 'todo', title: 'A' }
const todoB: TestItem = { id: 'b', statusId: 'todo', title: 'B' }
const doneC: TestItem = { id: 'c', statusId: 'done', title: 'C' }
const doneD: TestItem = { id: 'd', statusId: 'done', title: 'D' }

function collectionOf(items: readonly TestItem[]) {
  return {
    getKey: (item: TestItem) => item.id,
    getLabel: (item: TestItem) => item.title,
    groupings,
    items: [...items],
  }
}

function createRenderer(prefix = '') {
  const calls: string[] = []
  const renderItem = (item: TestItem): ReactNode => {
    calls.push(item.id)
    return <p data-testid={`item-${item.id}`}>{`${prefix}${item.title}`}</p>
  }
  return { calls, renderItem }
}

describe.each([
  { grouping: null, label: 'flat' },
  { grouping: 'status', label: 'grouped' },
] as const)('ListView item renders ($label)', ({ grouping }) => {
  const items = [todoA, todoB, doneC, doneD]
  const collection = collectionOf(items)

  test('skips every item when the parent re-renders with the same props', () => {
    const { calls, renderItem } = createRenderer()
    const props = { collection, grouping, renderItem }
    const { rerender } = render(<ListView<TestItem> {...props} />)
    expect(calls.sort()).toEqual(['a', 'b', 'c', 'd'])

    calls.length = 0
    rerender(<ListView<TestItem> {...props} />)

    expect(calls).toEqual([])
  })

  test('re-renders every item when renderItem changes identity', () => {
    const first = createRenderer()
    const { rerender } = render(
      <ListView<TestItem>
        collection={collection}
        grouping={grouping}
        renderItem={first.renderItem}
      />,
    )

    const second = createRenderer('next ')
    rerender(
      <ListView<TestItem>
        collection={collection}
        grouping={grouping}
        renderItem={second.renderItem}
      />,
    )

    expect(second.calls.sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(screen.getByTestId('item-a').textContent).toBe('next A')
    expect(screen.getByTestId('item-d').textContent).toBe('next D')
  })

  test('re-renders only the item whose object was replaced', () => {
    const { calls, renderItem } = createRenderer()
    const { rerender } = render(
      <ListView<TestItem>
        collection={collection}
        grouping={grouping}
        renderItem={renderItem}
      />,
    )

    calls.length = 0
    const renamed = { ...doneC, title: 'C renamed' }
    rerender(
      <ListView<TestItem>
        collection={collectionOf([todoA, todoB, renamed, doneD])}
        grouping={grouping}
        renderItem={renderItem}
      />,
    )

    expect(calls).toEqual(['c'])
    expect(screen.getByTestId('item-c').textContent).toBe('C renamed')
    expect(screen.getByTestId('item-a').textContent).toBe('A')
  })

  test('keeps the item order', () => {
    const { renderItem } = createRenderer()
    render(
      <ListView<TestItem>
        collection={collection}
        grouping={grouping}
        renderItem={renderItem}
      />,
    )

    expect(
      screen.getAllByTestId(/^item-/).map((node) => node.textContent),
    ).toEqual(['A', 'B', 'C', 'D'])
  })
})

describe('ListView collapse and item renders', () => {
  const items = [todoA, todoB, doneC, doneD]

  test('toggling an uncontrolled group renders only that group items on expand', () => {
    const { calls, renderItem } = createRenderer()
    render(
      <ListView<TestItem>
        collection={collectionOf(items)}
        grouping="status"
        renderItem={renderItem}
      />,
    )

    calls.length = 0
    fireEvent.click(screen.getByLabelText('Collapse Todo'))
    expect(calls).toEqual([])
    expect(screen.queryByTestId('item-a')).toBeNull()

    fireEvent.click(screen.getByLabelText('Expand Todo'))
    expect(calls.sort()).toEqual(['a', 'b'])
    expect(screen.getByTestId('item-a')).toBeTruthy()
  })

  test('controlled collapsedGroupIds hides the leaves of a collapsed group and reports toggles', () => {
    const { calls, renderItem } = createRenderer()
    const changes: (readonly string[])[] = []
    const collection = collectionOf(items)
    const { rerender } = render(
      <ListView<TestItem>
        collapsedGroupIds={['status:todo']}
        collection={collection}
        grouping="status"
        onCollapsedGroupIdsChange={(ids) => changes.push(ids)}
        renderItem={renderItem}
      />,
    )

    expect(calls.sort()).toEqual(['c', 'd'])
    expect(screen.queryByTestId('item-a')).toBeNull()

    fireEvent.click(screen.getByLabelText('Collapse Done'))
    expect(changes).toEqual([['status:todo', 'status:done']])
    expect(screen.getByTestId('item-c')).toBeTruthy()

    calls.length = 0
    rerender(
      <ListView<TestItem>
        collapsedGroupIds={[]}
        collection={collection}
        grouping="status"
        onCollapsedGroupIdsChange={(ids) => changes.push(ids)}
        renderItem={renderItem}
      />,
    )

    expect(calls.sort()).toEqual(['a', 'b'])
    expect(screen.getByTestId('item-a')).toBeTruthy()
  })
})
