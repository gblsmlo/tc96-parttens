import { afterEach, expect, test } from 'bun:test'

await import('../properties/test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, {
  AbortController: window.AbortController,
  AbortSignal: window.AbortSignal,
  ResizeObserver: ResizeObserverStub,
})

const { cleanup, fireEvent, render, screen, waitFor } = await import(
  '@testing-library/react'
)
const { Checklist } = await import('./checklist')

afterEach(cleanup)

const items = [
  { completed: false, id: 'first', title: 'Primeira etapa' },
  { completed: true, id: 'second', title: 'Segunda etapa' },
]

test('shows progress and delegates checklist changes to the consumer', () => {
  const events: string[] = []
  render(
    <Checklist
      ariaLabel="Checklist"
      items={items}
      newItemTitle="Nova etapa"
      onCreate={(title, completed) =>
        events.push(`create:${title}:${completed}`)
      }
      onItemCompletionChange={(id, completed) =>
        events.push(`complete:${id}:${completed}`)
      }
      onItemDelete={(id) => events.push(`delete:${id}`)}
      onItemMove={(id, index) => events.push(`move:${id}:${index}`)}
      onItemRename={(id, title) => events.push(`rename:${id}:${title}`)}
      onNewItemTitleChange={() => undefined}
      progress
      title="Etapas"
    />,
  )

  expect(screen.getByText('1 de 2 concluídos')).toBeTruthy()
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe(
    '1',
  )
  fireEvent.click(screen.getByRole('checkbox', { name: 'Primeira etapa' }))
  const title = screen.getByRole('textbox', { name: 'Título: Primeira etapa' })
  fireEvent.change(title, { target: { value: 'Etapa revisada' } })
  fireEvent.blur(title)
  fireEvent.keyDown(
    screen.getByRole('button', { name: 'Reordenar Primeira etapa' }),
    {
      altKey: true,
      key: 'ArrowDown',
    },
  )
  fireEvent.click(
    screen.getByRole('button', { name: 'Excluir Primeira etapa' }),
  )
  const form = screen
    .getByRole('textbox', { name: 'Novo item' })
    .closest('form')
  if (!form) throw new Error('Checklist composer form not found')
  fireEvent.submit(form)
  expect(events).toEqual([
    'complete:first:true',
    'rename:first:Etapa revisada',
    'move:first:1',
    'delete:first',
    'create:Nova etapa:false',
  ])
})

test('read-only checklist exposes item states without editing controls', () => {
  render(
    <Checklist
      ariaLabel="Checklist"
      items={items}
      newItemTitle=""
      onCreate={() => undefined}
      onItemCompletionChange={() => undefined}
      onItemMove={() => undefined}
      onItemRename={() => undefined}
      onNewItemTitleChange={() => undefined}
      readOnly
      title={null}
    />,
  )
  expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  expect(screen.queryByRole('textbox')).toBeNull()
  expect(screen.queryByRole('button')).toBeNull()
  expect(screen.queryByText('1 de 2 concluídos')).toBeNull()
})

test('renders checklist items as flat rows inside one outlined list', () => {
  render(
    <Checklist
      ariaLabel="Checklist"
      items={items}
      newItemTitle=""
      onCreate={() => undefined}
      onItemCompletionChange={() => undefined}
      onItemMove={() => undefined}
      onItemRename={() => undefined}
      onNewItemTitleChange={() => undefined}
      title="Etapas"
    />,
  )

  const list = document.querySelector('[data-slot="checklist-items"]')
  expect(list?.className).toContain('rounded-xl')
  expect(list?.className).toContain('border')
  expect(list?.querySelectorAll('[data-slot="card"]')).toHaveLength(0)
  const firstRow = list?.querySelector('li')
  expect(firstRow?.className).toContain('hover:bg-muted/60')
})

test('opens an item from its row while keeping completion separate', () => {
  const events: string[] = []
  render(
    <Checklist
      ariaLabel="Checklist"
      items={items}
      newItemTitle=""
      onCreate={() => undefined}
      onItemClick={(item) => events.push(`open:${item.id}`)}
      onItemCompletionChange={(id, completed) =>
        events.push(`complete:${id}:${completed}`)
      }
      onItemMove={() => undefined}
      onItemRename={(id, title) => events.push(`rename:${id}:${title}`)}
      onNewItemTitleChange={() => undefined}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Abrir Primeira etapa' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Primeira etapa' }))
  expect(events).toEqual(['open:first', 'complete:first:true'])
  expect(screen.queryByRole('button', { name: /Ações de/ })).toBeNull()
})

test('shows author and due date actions and delegates their changes', async () => {
  const events: string[] = []
  render(
    <Checklist
      ariaLabel="Checklist"
      authorOptions={[
        { value: 'gabriel', label: 'Gabriel Melo', fallback: 'GM' },
        { value: 'ana', label: 'Ana Souza', fallback: 'AS' },
      ]}
      items={[
        {
          ...items[0],
          authorId: 'gabriel',
          dueDate: '2026-10-01T12:00:00.000Z',
        },
      ]}
      newItemTitle=""
      onCreate={() => undefined}
      onItemAuthorChange={(id, authorId) =>
        events.push(`author:${id}:${authorId}`)
      }
      onItemCompletionChange={() => undefined}
      onItemDueDateChange={(id, dueDate) => events.push(`due:${id}:${dueDate}`)}
      onItemMove={() => undefined}
      onItemRename={() => undefined}
      onNewItemTitleChange={() => undefined}
    />,
  )

  fireEvent.click(
    screen.getByRole('combobox', { name: 'Author: Gabriel Melo' }),
  )
  const authorOption = await screen.findByRole('option', { name: 'Ana Souza' })
  fireEvent.pointerDown(authorOption, { pointerType: 'mouse' })
  fireEvent.click(authorOption)
  fireEvent.click(screen.getByRole('button', { name: /^Due date:/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Limpar data' }))

  expect(events).toEqual(['author:first:ana', 'due:first:null'])
})

test('names due dates near today as Today and Yesterday', () => {
  const today = new Date()
  const utcDay = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    12,
  )
  render(
    <Checklist
      ariaLabel="Checklist"
      items={[
        { ...items[0], dueDate: new Date(utcDay).toISOString() },
        { ...items[1], dueDate: new Date(utcDay - 86_400_000).toISOString() },
      ]}
      newItemTitle=""
      onCreate={() => undefined}
      onItemCompletionChange={() => undefined}
      onItemMove={() => undefined}
      onItemRename={() => undefined}
      onNewItemTitleChange={() => undefined}
      readOnly
    />,
  )

  expect(screen.getByText('Today')).toBeTruthy()
  expect(screen.getByText('Yesterday')).toBeTruthy()
})
