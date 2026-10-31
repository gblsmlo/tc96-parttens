import { describe, expect, test } from 'bun:test'

await import('../../../test/dom')

class MockResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.assign(globalThis, { ResizeObserver: MockResizeObserver })

const { renderToString } = await import('react-dom/server')
const { KanbanView } = await import('./kanban-view')

describe('KanbanView', () => {
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
