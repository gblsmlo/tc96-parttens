import { afterEach, expect, test } from 'bun:test'

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
const { SettingsCollapsed } = await import('./settings-collapsed')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

test('keeps the title and action visible while the content is collapsed', async () => {
  render(
    <SettingsCollapsed
      actions={<button type="button">Add item</button>}
      defaultOpen={false}
      title="Items"
    >
      <p>Nested row</p>
    </SettingsCollapsed>,
  )

  const region = screen.getByRole('region', { name: 'Items' })
  const heading = screen.getByRole('heading', { level: 2, name: 'Items' })
  const trigger = within(heading).getByRole('button', { name: 'Items' })
  const action = screen.getByRole('button', { name: 'Add item' })

  expect(region.dataset.slot).toBe('settings-collapsed')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Nested row')).toBeNull()
  expect(region.contains(action)).toBe(true)
  expect(trigger.contains(action)).toBe(false)

  fireEvent.click(action)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')

  fireEvent.click(trigger)
  await waitFor(() => expect(screen.queryByText('Nested row')).not.toBeNull())
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
})

test('starts expanded and reports a collapse', async () => {
  const changes: boolean[] = []
  render(
    <SettingsCollapsed
      onOpenChange={(open) => changes.push(open)}
      title="Items"
    >
      <p>Nested row</p>
    </SettingsCollapsed>,
  )

  const trigger = screen.getByRole('button', { name: 'Items' })
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByText('Nested row')).toBeTruthy()

  fireEvent.click(trigger)
  await waitFor(() => expect(screen.queryByText('Nested row')).toBeNull())
  expect(changes).toEqual([false])
})

test('follows the controlled open value', async () => {
  const changes: boolean[] = []
  const { rerender } = render(
    <SettingsCollapsed
      onOpenChange={(open) => changes.push(open)}
      open={false}
      title="Items"
    >
      <p>Nested row</p>
    </SettingsCollapsed>,
  )

  const trigger = screen.getByRole('button', { name: 'Items' })
  fireEvent.click(trigger)
  expect(changes).toEqual([true])
  expect(trigger.getAttribute('aria-expanded')).toBe('false')

  rerender(
    <SettingsCollapsed open title="Items">
      <p>Nested row</p>
    </SettingsCollapsed>,
  )
  await waitFor(() => expect(screen.queryByText('Nested row')).not.toBeNull())
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
})
