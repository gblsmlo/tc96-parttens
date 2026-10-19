import { afterEach, expect, mock, test } from 'bun:test'
import type { ComponentProps } from 'react'

await import('../../test/dom')

const { cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { ChatsPanelItem } = await import('./chats-panel-item')

afterEach(cleanup)

function mount(props: Partial<ComponentProps<typeof ChatsPanelItem>> = {}) {
  return render(
    <ul>
      <ChatsPanelItem
        avatar={<span>MC</span>}
        channel={<svg data-testid="brand" />}
        channelLabel="Messenger"
        name="Marina Costa"
        preview="Consegue me mandar a proposta?"
        time="00:29"
        {...props}
      />
    </ul>,
  )
}

const trigger = () => screen.getByRole('button', { name: /Marina Costa/ })
const item = () => trigger().closest('li') as HTMLElement
const preview = () =>
  item().querySelector('[data-slot="chats-panel-item-preview"]') as HTMLElement

test('is a button inside a list item, named by the name, the channel, the time and the preview', () => {
  mount()

  expect(item().getAttribute('data-slot')).toBe('chats-panel-item')
  expect(trigger().getAttribute('type')).toBe('button')
  expect(
    screen.getByRole('button', {
      name: 'Marina Costa Messenger 00:29 Consegue me mandar a proposta?',
    }),
  ).toBe(trigger())
})

test('hides the avatar slot, with its badge and channel mark, from assistive technology', () => {
  mount({ unreadCount: 2, unreadLabel: '2 não lidas' })

  const slot = item().querySelector('[data-slot="chats-panel-item-avatar"]')

  expect(slot?.getAttribute('aria-hidden')).toBe('true')
  expect(slot?.querySelector('[data-slot="badge"]')?.textContent).toBe('2')
  expect(slot?.contains(screen.getByTestId('brand'))).toBe(true)
})

test('speaks the unread label and inks the preview when there are unread messages', () => {
  mount({ unreadCount: 2, unreadLabel: '2 não lidas' })

  expect(item().getAttribute('data-unread')).toBe('true')
  expect(
    screen.getByRole('button', {
      name: 'Marina Costa Messenger, 2 não lidas 00:29 Consegue me mandar a proposta?',
    }),
  ).toBe(trigger())
  expect(preview().className).toContain('text-foreground')
})

test('drops the badge and the unread label when the count is zero', () => {
  mount({ unreadCount: 0, unreadLabel: '0 não lidas' })

  expect(item().hasAttribute('data-unread')).toBe(false)
  expect(item().querySelector('[data-slot="badge"]')).toBeNull()
  expect(trigger().textContent).not.toContain('não lidas')
  expect(preview().className).toContain('text-muted-foreground')
})

test('marks the selected item with aria-current', () => {
  const { rerender } = mount({ selected: true })

  expect(trigger().getAttribute('aria-current')).toBe('true')

  rerender(
    <ul>
      <ChatsPanelItem avatar={null} name="Marina Costa" />
    </ul>,
  )

  expect(trigger().hasAttribute('aria-current')).toBe(false)
})

test('omits the channel mark, time and preview when not passed', () => {
  render(
    <ul>
      <ChatsPanelItem avatar={null} name="Marina Costa" />
    </ul>,
  )

  expect(trigger().textContent).toBe('Marina Costa')
  expect(
    item().querySelector('[data-slot="chats-panel-item-channel"]'),
  ).toBeNull()
  expect(item().querySelector('[data-slot="chats-panel-item-time"]')).toBeNull()
  expect(
    item().querySelector('[data-slot="chats-panel-item-preview"]'),
  ).toBeNull()
})

test('calls onClick when pressed', () => {
  const onClick = mock(() => {})
  mount({ onClick })

  fireEvent.click(trigger())

  expect(onClick).toHaveBeenCalledTimes(1)
})

test('renders the consumer element through render, without a button type', () => {
  render(
    <ul>
      <ChatsPanelItem
        avatar={null}
        name="Marina Costa"
        render={(props) => <a {...props} href="/chats/marina" />}
        selected
      />
    </ul>,
  )

  const link = screen.getByRole('link', { name: 'Marina Costa' })

  expect(link.getAttribute('href')).toBe('/chats/marina')
  expect(link.hasAttribute('type')).toBe(false)
  expect(link.getAttribute('aria-current')).toBe('true')
})
