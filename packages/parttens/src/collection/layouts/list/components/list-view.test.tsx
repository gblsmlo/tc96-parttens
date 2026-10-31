import { afterEach, describe, expect, test } from 'bun:test'

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

const twoStatusGroupings = [
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

function collectionOf(records: readonly TestRecord[]) {
  return {
    getKey: (record: TestRecord) => record.id,
    getLabel: (record: TestRecord) => record.title,
    groupings: twoStatusGroupings,
    records: [...records],
  }
}

const isGroupOpen = (container: HTMLElement, groupLabel: string) =>
  Boolean(
    container
      .querySelector(`[aria-label="Collapse ${groupLabel}"]`)
      ?.closest('[data-slot="list-group"]'),
  )

// O badge circular de contagem e o crescimento do corpo da linha são asseverados na
// story `Collections/Views/List › GroupedByStatus`, em geometria renderizada.
describe('ListView', () => {
  test('renders one collection skeleton per known group while loading', () => {
    const { container } = render(
      <ListView<TestRecord>
        collection={{
          getKey: (record) => record.id,
          getLabel: (record) => record.title,
          groupings: [
            {
              getGroupId: (record) => record.statusId,
              id: 'status',
              label: 'Status',
              options: [
                { id: 'todo', label: 'Todo' },
                { id: 'done', label: 'Done' },
              ],
            },
          ],
          records: [],
        }}
        grouping="status"
        loading
        loadingRecordLabel="Carregando item da coleção"
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(
      container
        .querySelector('[data-slot="list-view"]')
        ?.getAttribute('aria-busy'),
    ).toBe('true')
    expect(
      screen.getAllByRole('status', { name: 'Carregando item da coleção' }),
    ).toHaveLength(2)
    expect(container.querySelectorAll('[data-slot="list-group"]')).toHaveLength(
      2,
    )
    expect(screen.queryByText('No items in this group.')).toBeNull()
  })

  test('renders canonical group metadata and a circular count badge', () => {
    const { container } = render(
      <ListView<TestRecord>
        collection={{
          getKey: (record) => record.id,
          getLabel: (record) => record.title,
          groupings: [
            {
              getGroupId: (record) => record.statusId,
              id: 'status',
              label: 'Status',
              options: [{ id: 'todo', label: 'Todo' }],
            },
          ],
          records: [{ id: 'item-1', statusId: 'todo', title: 'First item' }],
        }}
        grouping="status"
        renderGroupTitle={(group) => (
          <span data-status-property="true">{group.label}</span>
        )}
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Todo' })).toBeTruthy()
    expect(
      container.querySelector('[data-status-property="true"]'),
    ).toBeTruthy()

    const count = container.querySelector('[data-slot="list-group-count"]')
    expect(count?.textContent).toBe('1')
  })
})

describe('ListView without grouping', () => {
  test('reads the collection as a flat list, in the order the consumer passed', () => {
    const { container } = render(
      <ListView<TestRecord>
        collection={collectionOf([
          { id: 'item-1', statusId: 'done', title: 'First item' },
          { id: 'item-2', statusId: 'todo', title: 'Second item' },
        ])}
        grouping={null}
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    const view = container.querySelector('[data-slot="list-view"]')
    expect(view?.hasAttribute('data-collection-grouping')).toBe(false)
    expect(container.querySelectorAll('[data-slot="list-group"]')).toHaveLength(
      0,
    )

    // A ordem é a da coleção, não a das dimensões declaradas.
    const titles = Array.from(
      container.querySelectorAll('[data-slot="list-view-items"] > span'),
      (record) => record.textContent,
    )
    expect(titles).toEqual(['First item', 'Second item'])
  })

  test('renders the empty message when the flat collection has no items', () => {
    const { container } = render(
      <ListView<TestRecord>
        collection={collectionOf([])}
        emptyMessage="Nenhum contato para exibir."
        grouping={null}
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(screen.getByText('Nenhum contato para exibir.')).toBeTruthy()
    expect(container.querySelectorAll('[data-slot="list-item"]')).toHaveLength(
      0,
    )
  })

  test('falls back to the default message and hides it while loading or when items exist', () => {
    const view = render(
      <ListView<TestRecord>
        collection={collectionOf([])}
        grouping={null}
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )
    expect(screen.getByText('No items to show.')).toBeTruthy()

    view.rerender(
      <ListView<TestRecord>
        collection={collectionOf([])}
        grouping={null}
        loading
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )
    expect(screen.queryByText('No items to show.')).toBeNull()

    view.rerender(
      <ListView<TestRecord>
        collection={collectionOf([
          { id: 'item-1', statusId: 'done', title: 'First item' },
        ])}
        grouping={null}
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )
    expect(screen.queryByText('No items to show.')).toBeNull()
  })

  test('renders the requested skeleton count while loading', () => {
    const { container } = render(
      <ListView<TestRecord>
        collection={collectionOf([])}
        grouping={null}
        loading
        loadingRecordCount={3}
        loadingRecordLabel="Carregando item da coleção"
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(
      container
        .querySelector('[data-slot="list-view"]')
        ?.getAttribute('aria-busy'),
    ).toBe('true')
    expect(
      screen.getAllByRole('status', { name: 'Carregando item da coleção' }),
    ).toHaveLength(3)
  })
})

describe('ListView collapseEmptyGroups', () => {
  test('starts an empty group collapsed and keeps a populated one open', () => {
    const { container } = render(
      <ListView<TestRecord>
        collapseEmptyGroups
        collection={collectionOf([
          { id: 'item-1', statusId: 'todo', title: 'First item' },
        ])}
        grouping="status"
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(isGroupOpen(container, 'Todo')).toBe(true)
    expect(isGroupOpen(container, 'Done')).toBe(false)
  })

  test('keeps every group open while loading, even with no items yet', () => {
    const { container } = render(
      <ListView<TestRecord>
        collapseEmptyGroups
        collection={collectionOf([])}
        grouping="status"
        loading
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(isGroupOpen(container, 'Todo')).toBe(true)
    expect(isGroupOpen(container, 'Done')).toBe(true)
  })

  test('honours the manual choice over the emptiness of the group', () => {
    const { container } = render(
      <ListView<TestRecord>
        collapseEmptyGroups
        collection={collectionOf([
          { id: 'item-1', statusId: 'todo', title: 'First item' },
        ])}
        grouping="status"
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    // Abrir um grupo vazio permanece: a escolha manual vence o automático.
    fireEvent.click(screen.getByRole('button', { name: 'Expand Done' }))
    expect(isGroupOpen(container, 'Done')).toBe(true)

    // Fechar um grupo com itens também permanece.
    fireEvent.click(screen.getByRole('button', { name: 'Collapse Todo' }))
    expect(isGroupOpen(container, 'Todo')).toBe(false)
  })

  test('reopens an untouched group as soon as it receives items', () => {
    const { container, rerender } = render(
      <ListView<TestRecord>
        collapseEmptyGroups
        collection={collectionOf([])}
        grouping="status"
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(isGroupOpen(container, 'Done')).toBe(false)

    rerender(
      <ListView<TestRecord>
        collapseEmptyGroups
        collection={collectionOf([
          { id: 'item-1', statusId: 'done', title: 'First item' },
        ])}
        grouping="status"
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    expect(isGroupOpen(container, 'Done')).toBe(true)
  })

  test('reports the effective collapsed ids to the consumer', () => {
    const changes: readonly string[][] = []
    render(
      <ListView<TestRecord>
        collapseEmptyGroups
        collection={collectionOf([
          { id: 'item-1', statusId: 'todo', title: 'First item' },
        ])}
        grouping="status"
        onCollapsedGroupIdsChange={(groupIds) => {
          ;(changes as string[][]).push([...groupIds])
        }}
        renderRecord={(record) => <span>{record.title}</span>}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Collapse Todo' }))

    // O grupo vazio entra na lista junto do que a pessoa acabou de fechar.
    expect(changes.at(-1)).toEqual(['status:todo', 'status:done'])
  })
})
