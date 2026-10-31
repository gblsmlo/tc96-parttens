import { afterEach, describe, expect, test } from 'bun:test'
import type { ReactNode } from 'react'

await import('../../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ListView } = await import('./list-view')

afterEach(cleanup)

type TestRecord = {
  id: string
  statusId: string
  title: string
}

const groupings = [
  {
    getGroupId: (record: TestRecord) => record.statusId,
    id: 'status',
    label: 'Status',
    options: [
      { id: 'todo', label: 'Todo' },
      { id: 'done', label: 'Done' },
    ],
  },
]

const todoA: TestRecord = { id: 'a', statusId: 'todo', title: 'A' }
const todoB: TestRecord = { id: 'b', statusId: 'todo', title: 'B' }
const doneC: TestRecord = { id: 'c', statusId: 'done', title: 'C' }
const doneD: TestRecord = { id: 'd', statusId: 'done', title: 'D' }

function collectionOf(records: readonly TestRecord[]) {
  return {
    getKey: (record: TestRecord) => record.id,
    getLabel: (record: TestRecord) => record.title,
    groupings,
    records: [...records],
  }
}

function createRenderer(prefix = '') {
  const calls: string[] = []
  const renderRecord = (record: TestRecord): ReactNode => {
    calls.push(record.id)
    return <p data-testid={`item-${record.id}`}>{`${prefix}${record.title}`}</p>
  }
  return { calls, renderRecord }
}

describe.each([
  { grouping: null, label: 'flat' },
  { grouping: 'status', label: 'grouped' },
] as const)('ListView item renders ($label)', ({ grouping }) => {
  const records = [todoA, todoB, doneC, doneD]
  const collection = collectionOf(records)

  test('skips every item when the parent re-renders with the same props', () => {
    const { calls, renderRecord } = createRenderer()
    const props = { collection, grouping, renderRecord }
    const { rerender } = render(<ListView<TestRecord> {...props} />)
    expect(calls.sort()).toEqual(['a', 'b', 'c', 'd'])

    calls.length = 0
    rerender(<ListView<TestRecord> {...props} />)

    expect(calls).toEqual([])
  })

  test('re-renders every item when renderItem changes identity', () => {
    const first = createRenderer()
    const { rerender } = render(
      <ListView<TestRecord>
        collection={collection}
        grouping={grouping}
        renderRecord={first.renderRecord}
      />,
    )

    const second = createRenderer('next ')
    rerender(
      <ListView<TestRecord>
        collection={collection}
        grouping={grouping}
        renderRecord={second.renderRecord}
      />,
    )

    expect(second.calls.sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(screen.getByTestId('item-a').textContent).toBe('next A')
    expect(screen.getByTestId('item-d').textContent).toBe('next D')
  })

  test('re-renders only the item whose object was replaced', () => {
    const { calls, renderRecord } = createRenderer()
    const { rerender } = render(
      <ListView<TestRecord>
        collection={collection}
        grouping={grouping}
        renderRecord={renderRecord}
      />,
    )

    calls.length = 0
    const renamed = { ...doneC, title: 'C renamed' }
    rerender(
      <ListView<TestRecord>
        collection={collectionOf([todoA, todoB, renamed, doneD])}
        grouping={grouping}
        renderRecord={renderRecord}
      />,
    )

    expect(calls).toEqual(['c'])
    expect(screen.getByTestId('item-c').textContent).toBe('C renamed')
    expect(screen.getByTestId('item-a').textContent).toBe('A')
  })

  test('keeps the item order', () => {
    const { renderRecord } = createRenderer()
    render(
      <ListView<TestRecord>
        collection={collection}
        grouping={grouping}
        renderRecord={renderRecord}
      />,
    )

    expect(
      screen.getAllByTestId(/^item-/).map((node) => node.textContent),
    ).toEqual(['A', 'B', 'C', 'D'])
  })
})

describe('ListView collapse and item renders', () => {
  const records = [todoA, todoB, doneC, doneD]

  test('toggling an uncontrolled group renders only that group items on expand', () => {
    const { calls, renderRecord } = createRenderer()
    render(
      <ListView<TestRecord>
        collection={collectionOf(records)}
        grouping="status"
        renderRecord={renderRecord}
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
    const { calls, renderRecord } = createRenderer()
    const changes: (readonly string[])[] = []
    const collection = collectionOf(records)
    const { rerender } = render(
      <ListView<TestRecord>
        collapsedGroupIds={['status:todo']}
        collection={collection}
        grouping="status"
        onCollapsedGroupIdsChange={(ids) => changes.push(ids)}
        renderRecord={renderRecord}
      />,
    )

    expect(calls.sort()).toEqual(['c', 'd'])
    expect(screen.queryByTestId('item-a')).toBeNull()

    fireEvent.click(screen.getByLabelText('Collapse Done'))
    expect(changes).toEqual([['status:todo', 'status:done']])
    expect(screen.getByTestId('item-c')).toBeTruthy()

    calls.length = 0
    rerender(
      <ListView<TestRecord>
        collapsedGroupIds={[]}
        collection={collection}
        grouping="status"
        onCollapsedGroupIdsChange={(ids) => changes.push(ids)}
        renderRecord={renderRecord}
      />,
    )

    expect(calls.sort()).toEqual(['a', 'b'])
    expect(screen.getByTestId('item-a')).toBeTruthy()
  })
})
