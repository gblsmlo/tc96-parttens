import { afterEach, describe, expect, test } from 'bun:test'

await import('../../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { renderToString } = await import('react-dom/server')
const { KanbanView } = await import('./kanban-view')

afterEach(cleanup)

describe('KanbanView', () => {
  test('renders one canonical card skeleton per known column while loading', () => {
    const { container } = render(
      <KanbanView
        columns={[
          { cards: [], count: 0, id: 'todo', title: 'Todo' },
          { cards: [], count: 0, id: 'done', title: 'Done' },
        ]}
        getKey={(card: { id: string }) => card.id}
        loading
        loadingCardLabel="Carregando item da coleção"
        renderCard={(card) => <span>{card.id}</span>}
      />,
    )

    expect(
      container
        .querySelector('[data-slot="kanban-view"]')
        ?.getAttribute('aria-busy'),
    ).toBe('true')
    expect(
      screen.getAllByRole('status', { name: 'Carregando item da coleção' }),
    ).toHaveLength(3)
    expect(screen.queryByText('Nenhum item nesta coluna.')).toBeNull()
  })

  test('keeps the column label accessible while rendering canonical visual metadata', () => {
    render(
      <KanbanView
        columns={[
          { cards: [{ id: 'task-1' }], count: 1, id: 'todo', title: 'Todo' },
        ]}
        getKey={(card) => card.id}
        renderCard={(card) => <span>{card.id}</span>}
        renderColumnTitle={(column) => (
          <span data-testid="column-title">{column.id}</span>
        )}
      />,
    )

    expect(screen.getAllByRole('heading', { name: 'todo' })).toHaveLength(2)
    expect(screen.getAllByTestId('column-title')).toHaveLength(2)
    expect(screen.getAllByText('task-1')).toHaveLength(2)
  })

  test('uses a solid card surface and applies the optional column color as a subtle overlay', () => {
    const { container } = render(
      <KanbanView
        columns={[
          { cards: [], color: '#ef4444', count: 0, id: 'lost', title: 'Lost' },
        ]}
        getKey={(card: { id: string }) => card.id}
        renderCard={(card) => <span>{card.id}</span>}
      />,
    )

    const column = container.querySelector('section[data-slot="kanban-column"]')
    expect(column?.className).toContain('bg-card')
    expect(column?.className).toContain('border-border')
    expect(column?.className).toContain('shadow-none')
    expect(column?.getAttribute('style')).toContain(
      'color-mix(in srgb, var(--card) 96%, #ef4444 4%)',
    )
    expect(column?.getAttribute('style')).toContain(
      'border-color: color-mix(in srgb, rgb(239, 68, 68) 8%, transparent)',
    )
  })

  test('renders a collapsed column without its cards and omits hidden columns', () => {
    const { container } = render(
      <KanbanView
        columns={[
          {
            cards: [{ id: 'task-1' }],
            collapsed: true,
            count: 1,
            id: 'todo',
            title: 'Todo',
          },
          {
            cards: [{ id: 'task-2' }],
            count: 1,
            hidden: true,
            id: 'done',
            title: 'Done',
          },
        ]}
        getKey={(card) => card.id}
        renderCard={(card) => <span>{card.id}</span>}
      />,
    )

    expect(
      container.querySelectorAll('section[data-collapsed="true"]'),
    ).toHaveLength(2)
    expect(screen.queryByText('task-1')).toBeNull()
    expect(screen.queryByText('task-2')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Done' })).toBeNull()
  })

  test('supports header action slots and the add card trigger in the header only', () => {
    const added: string[] = []
    render(
      <KanbanView
        columns={[{ cards: [], count: 0, id: 'todo', title: 'Todo' }]}
        getColumnActions={() => ({ onAddCard: (id) => added.push(id) })}
        getKey={(card: { id: string }) => card.id}
        renderCard={(card) => <span>{card.id}</span>}
        renderHeaderActions={(column) => (
          <button type="button">More {column.title}</button>
        )}
      />,
    )

    expect(screen.getAllByRole('button', { name: 'More Todo' })).toHaveLength(2)
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Adicionar item à seção Todo' })[0],
    )
    expect(
      screen.queryByRole('button', { name: 'Adicionar card em Todo' }),
    ).toBeNull()
    expect(added).toEqual(['todo'])
  })

  test('keeps card drag off in the mobile panel and on in the desktop board', () => {
    const { container } = render(
      <KanbanView
        columns={[
          {
            cards: [{ id: 'task-1' }, { id: 'task-2' }],
            count: 2,
            id: 'todo',
            title: 'Todo',
          },
        ]}
        getKey={(card) => card.id}
        onMoveCard={() => true}
        renderCard={(card) => <span>{card.id}</span>}
      />,
    )

    const mobilePanel = container.querySelector('div.grid.md\\:hidden')
    const board = container.querySelector('[data-kanban-board-scroll-area]')

    expect(
      mobilePanel?.querySelectorAll('[data-slot="kanban-column"]'),
    ).toHaveLength(1)
    expect(mobilePanel?.textContent).toContain('task-1')
    expect(
      mobilePanel?.querySelectorAll('[data-kanban-card-drag-handle]'),
    ).toHaveLength(0)
    expect(
      board?.querySelectorAll('[data-kanban-card-drag-handle]'),
    ).toHaveLength(2)
  })

  test('server renders both the mobile panel and the desktop board', () => {
    const html = renderToString(
      <KanbanView
        columns={[
          { cards: [{ id: 'task-1' }], count: 1, id: 'todo', title: 'Todo' },
        ]}
        getKey={(card) => card.id}
        renderCard={(card) => <span>{card.id}</span>}
      />,
    )

    expect(html).toContain('grid min-h-0 flex-1 gap-2 md:hidden')
    expect(html).toContain('data-kanban-board-scroll-area')
    expect(html.match(/data-slot="kanban-column"/g)).toHaveLength(2)
    expect(html.match(/task-1/g)).toHaveLength(2)
  })
})
