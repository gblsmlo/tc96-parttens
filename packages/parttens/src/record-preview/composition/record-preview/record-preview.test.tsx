import { afterEach, expect, test } from 'bun:test'
import type { ComponentProps } from 'react'

await import('../../test/dom')

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
Object.assign(window.Element.prototype, { getAnimations: () => [] })

const { act, cleanup, fireEvent, render, screen, waitFor, within } =
  await import('@testing-library/react')
const { RecordPreview } = await import('./record-preview')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

function mount(props: Partial<ComponentProps<typeof RecordPreview>> = {}) {
  const changes: boolean[] = []
  render(
    <RecordPreview
      closeLabel="Close preview"
      onOpenChange={(next) => changes.push(next)}
      open
      title="Task 42"
      {...props}
    >
      <p>Body</p>
    </RecordPreview>,
  )
  return changes
}

test('names the dialog after the title and renders a single close button with the given label', () => {
  mount()

  const dialog = screen.getByRole('dialog', { name: 'Task 42' })
  const closes = dialog.querySelectorAll('[data-slot="sheet-close"]')

  expect(closes).toHaveLength(1)
  expect(closes[0]?.getAttribute('aria-label')).toBe('Close preview')
  expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
})

test('renders the description and the actions before the close button', () => {
  mount({
    actions: <button type="button">Open page</button>,
    description: 'Sprint 12',
  })

  const dialog = screen.getByRole('dialog', { name: 'Task 42' })
  const slot = document.querySelector(
    '[data-slot="record-preview-header-actions"]',
  )
  const close = within(dialog).getByRole('button', { name: 'Close preview' })

  expect(within(dialog).getByText('Sprint 12')).toBeTruthy()
  expect(slot?.contains(within(dialog).getByText('Open page'))).toBe(true)
  expect(slot?.parentElement).toBe(close.parentElement)
  expect(
    (slot?.compareDocumentPosition(close) ?? 0) &
      window.Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
})

test('omits the actions slot when no actions are passed', () => {
  mount()

  expect(
    document.querySelector('[data-slot="record-preview-header-actions"]'),
  ).toBeNull()
})

test('renders the footer outside the scrolling panel only when passed', () => {
  const { unmount } = render(
    <RecordPreview
      closeLabel="Close preview"
      onOpenChange={() => undefined}
      open
      title="Task 42"
    />,
  )
  expect(document.querySelector('[data-slot="sheet-footer"]')).toBeNull()
  unmount()

  mount({ footer: <button type="button">Restore</button> })

  const footer = document.querySelector('[data-slot="sheet-footer"]')
  const panel = document.querySelector('[data-slot="sheet-panel"]')

  expect(footer?.textContent).toBe('Restore')
  expect(panel).toBeTruthy()
  expect(panel?.contains(footer ?? null)).toBe(false)
  expect(footer?.closest('[data-slot="scroll-area"]')).toBeNull()
})

test('Escape requests closing', async () => {
  const changes = mount()

  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

  await waitFor(() => expect(changes).toEqual([false]))
})

test('the close button requests closing', async () => {
  const changes = mount()

  fireEvent.click(screen.getByRole('button', { name: 'Close preview' }))

  await waitFor(() => expect(changes).toEqual([false]))
})

test('an outside press requests closing', async () => {
  const changes = mount()

  const target = document.querySelector('[data-slot="sheet-viewport"]')
  if (!target) throw new Error('sheet viewport not rendered')
  fireEvent.pointerDown(target)
  fireEvent.mouseDown(target)
  fireEvent.pointerUp(target)
  fireEvent.mouseUp(target)
  fireEvent.click(target)

  await waitFor(() => expect(changes).toEqual([false]))
})

test('moves initial focus to the popup, which is programmatically focusable', async () => {
  mount()

  const dialog = screen.getByRole('dialog', { name: 'Task 42' })

  expect(dialog.getAttribute('tabindex')).toBe('-1')
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  expect(document.activeElement).toBe(dialog)
})

test('does not truncate a long title', () => {
  mount({ title: 'A very long record title '.repeat(12) })

  const title = document.querySelector('[data-slot="sheet-title"]')

  expect(title?.className.includes('truncate')).toBe(false)
  expect(title?.parentElement?.className).toContain('min-w-0')
  expect(screen.getByRole('button', { name: 'Close preview' })).toBeTruthy()
})

test('forwards className to the popup', () => {
  mount({ className: 'proof-class' })

  expect(
    document
      .querySelector('[data-slot="sheet-popup"]')
      ?.classList.contains('proof-class'),
  ).toBe(true)
})

const added: HTMLElement[] = []

afterEach(() => {
  for (const element of added.splice(0)) element.remove()
})

function addButton(text: string) {
  const button = document.createElement('button')
  button.textContent = text
  document.body.append(button)
  added.push(button)
  return button
}

function mountWithTrigger(finalFocus?: () => HTMLElement | null) {
  const trigger = addButton('Trigger')
  trigger.focus()

  const props = {
    closeLabel: 'Close preview',
    finalFocus,
    onOpenChange: () => undefined,
    title: 'Task 42',
  }
  const view = render(<RecordPreview {...props} open />)
  return { trigger, view, props }
}

test('moves focus to the element finalFocus returns when closing', async () => {
  const target = addButton('Moved card')
  const { view, props } = mountWithTrigger(() => target)

  await screen.findByRole('dialog')
  view.rerender(<RecordPreview {...props} open={false} />)

  await waitFor(() => expect(document.activeElement).toBe(target))
})

test('keeps focus on the trigger when finalFocus returns null', async () => {
  const { trigger, view, props } = mountWithTrigger(() => null)

  await screen.findByRole('dialog')
  view.rerender(<RecordPreview {...props} open={false} />)

  await waitFor(() => expect(document.activeElement).toBe(trigger))
})
