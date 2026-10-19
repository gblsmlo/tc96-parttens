import { afterEach, expect, test } from 'bun:test'
import type { ComponentProps } from 'react'

await import('../../test/dom')

class ResizeObserverStub {
  disconnect() {}
  observe() {}
  unobserve() {}
}
Object.assign(globalThis, { ResizeObserver: ResizeObserverStub })

const { act, cleanup, render, screen } = await import('@testing-library/react')
const { ChatsPanel } = await import('./chats-panel')
const { ChatsPanelList } = await import('../chats-panel-list/chats-panel-list')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

function mount(props: Partial<ComponentProps<typeof ChatsPanel>> = {}) {
  return render(
    <ChatsPanel title="Chat" {...props}>
      <ChatsPanelList>
        <li>Marina Costa</li>
      </ChatsPanelList>
    </ChatsPanel>,
  )
}

const panel = () => screen.getByRole('region', { name: 'Chat' })
const header = () =>
  panel().querySelector('[data-slot="chats-panel-header"]') as HTMLElement
const body = () =>
  panel().querySelector('[data-slot="chats-panel-body"]') as HTMLElement

test('is a section named by its h2 title, plain by default', () => {
  mount()

  expect(panel().tagName).toBe('SECTION')
  expect(panel().getAttribute('data-slot')).toBe('chats-panel')
  expect(panel().getAttribute('data-variant')).toBe('plain')
  expect(panel().querySelector('h2')?.textContent).toBe('Chat')
})

test('names the list by the panel title', () => {
  mount()

  expect(screen.getByRole('list', { name: 'Chat' }).tagName).toBe('UL')
})

test('plain renders no card', () => {
  mount()

  expect(panel().querySelector('[data-slot="card"]')).toBeNull()
})

test('card wraps the header and the body in one card', () => {
  mount({ variant: 'card' })

  const card = panel().querySelector('[data-slot="card"]')

  expect(card?.parentElement).toBe(panel())
  expect(card?.contains(header())).toBe(true)
  expect(card?.contains(body())).toBe(true)
})

test('inset keeps the header outside and wraps only the body', () => {
  mount({ variant: 'inset' })

  const card = panel().querySelector('[data-slot="card"]')

  expect(header().parentElement).toBe(panel())
  expect(card?.contains(header())).toBe(false)
  expect(card?.contains(body())).toBe(true)
})

test('renders actions next to the title only when passed', () => {
  const { rerender } = mount()

  expect(panel().querySelector('[data-slot="chats-panel-actions"]')).toBeNull()

  rerender(
    <ChatsPanel actions={<button type="button">Exibição</button>} title="Chat">
      <p>Body</p>
    </ChatsPanel>,
  )

  const actions = panel().querySelector('[data-slot="chats-panel-actions"]')

  expect(actions?.textContent).toBe('Exibição')
  expect(
    panel()
      .querySelector('h2')
      ?.contains(actions ?? null),
  ).toBe(false)
})

test('sizes avatars from the panel and lets className override the size', () => {
  const { rerender } = mount()

  expect(panel().className).toContain('[--avatar-size:--spacing(10)]')

  rerender(
    <ChatsPanel className="[--avatar-size:--spacing(8)]" title="Chat">
      <p>Body</p>
    </ChatsPanel>,
  )

  expect(panel().className).toContain('[--avatar-size:--spacing(8)]')
  expect(panel().className).not.toContain('[--avatar-size:--spacing(10)]')
})
