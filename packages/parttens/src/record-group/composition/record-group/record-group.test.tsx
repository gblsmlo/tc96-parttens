import { afterEach, expect, test } from 'bun:test'
import { type ComponentProps, useState } from 'react'

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

const { act, cleanup, fireEvent, render, screen, waitFor } = await import(
  '@testing-library/react'
)
const { RecordGroup } = await import('./record-group')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

function mount(props: Partial<ComponentProps<typeof RecordGroup>> = {}) {
  return render(
    <RecordGroup title="Details" {...props}>
      <p>Body</p>
    </RecordGroup>,
  )
}

const trigger = () => screen.getByRole('button', { name: 'Details' })

test('is a region named by its title', () => {
  mount()

  const region = screen.getByRole('region', { name: 'Details' })

  expect(region.tagName).toBe('SECTION')
  expect(region.getAttribute('data-slot')).toBe('record-group')
  expect(region.querySelector('h2')?.textContent).toBe('Details')
})

test('toggles the body and the trigger state when the title is clicked', async () => {
  mount()

  expect(trigger().getAttribute('aria-expanded')).toBe('true')
  expect(screen.queryByText('Body')).not.toBeNull()

  fireEvent.click(trigger())

  await waitFor(() => expect(screen.queryByText('Body')).toBeNull())
  expect(trigger().getAttribute('aria-expanded')).toBe('false')
  expect(trigger().hasAttribute('data-panel-open')).toBe(false)

  fireEvent.click(trigger())

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
  expect(trigger().getAttribute('aria-expanded')).toBe('true')
  expect(trigger().hasAttribute('data-panel-open')).toBe(true)
})

test('starts closed with defaultOpen false', () => {
  mount({ defaultOpen: false })

  expect(trigger().getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Body')).toBeNull()
})

test('calls onOpenChange when uncontrolled', async () => {
  const changes: boolean[] = []
  mount({ onOpenChange: (next) => changes.push(next) })

  fireEvent.click(trigger())
  await waitFor(() =>
    expect(trigger().getAttribute('aria-expanded')).toBe('false'),
  )

  expect(changes).toEqual([false])
})

test('follows open and reports onOpenChange without changing it when controlled', async () => {
  const changes: boolean[] = []
  const { rerender } = render(
    <RecordGroup
      onOpenChange={(next) => changes.push(next)}
      open={false}
      title="Details"
    >
      <p>Body</p>
    </RecordGroup>,
  )

  expect(screen.queryByText('Body')).toBeNull()

  fireEvent.click(trigger())

  expect(changes).toEqual([true])
  expect(trigger().getAttribute('aria-expanded')).toBe('false')

  rerender(
    <RecordGroup
      onOpenChange={(next) => changes.push(next)}
      open
      title="Details"
    >
      <p>Body</p>
    </RecordGroup>,
  )

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
  expect(trigger().getAttribute('aria-expanded')).toBe('true')
})

test('starts closed when empty and marks the group', () => {
  mount({ empty: true })

  const region = screen.getByRole('region', { name: 'Details' })

  expect(trigger().getAttribute('aria-expanded')).toBe('false')
  expect(region.getAttribute('data-empty')).toBe('true')
})

test('keeps the empty marker on the group while the user opens it', async () => {
  mount({ empty: true })

  fireEvent.click(trigger())

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
  expect(
    screen.getByRole('region', { name: 'Details' }).getAttribute('data-empty'),
  ).toBe('true')
})

test('does not mark a group that is not empty', () => {
  mount()

  expect(
    screen.getByRole('region', { name: 'Details' }).hasAttribute('data-empty'),
  ).toBe(false)
})

test('renders the footer after the body when an empty group is opened by the user', async () => {
  mount({ empty: true, footer: <p>Footer</p> })

  expect(document.querySelector('[data-slot="record-group-footer"]')).toBeNull()

  fireEvent.click(trigger())

  await waitFor(() => expect(screen.queryByText('Footer')).not.toBeNull())
  const panel = document.querySelector('[data-slot="collapsible-panel"]')
  expect(
    [...(panel?.children ?? [])].map((child) =>
      child.getAttribute('data-slot'),
    ),
  ).toEqual(['record-group-content', 'record-group-footer'])
  expect(screen.queryByText('Body')).not.toBeNull()
})

test('opens on the empty flip to false without calling onOpenChange', async () => {
  const changes: boolean[] = []
  const onOpenChange = (next: boolean) => changes.push(next)
  const { rerender } = render(
    <RecordGroup empty onOpenChange={onOpenChange} title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  rerender(
    <RecordGroup empty={false} onOpenChange={onOpenChange} title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
  expect(changes).toEqual([])
})

test('lets a controlled open win over empty', async () => {
  const { rerender } = render(
    <RecordGroup empty open title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  expect(trigger().getAttribute('aria-expanded')).toBe('true')
  expect(screen.queryByText('Body')).not.toBeNull()

  rerender(
    <RecordGroup empty={false} open={false} title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  await waitFor(() => expect(screen.queryByText('Body')).toBeNull())
  expect(trigger().getAttribute('aria-expanded')).toBe('false')
})

test('leaves the open state alone when empty flips to true', () => {
  const { rerender } = render(
    <RecordGroup empty={false} title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  rerender(
    <RecordGroup empty title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  expect(trigger().getAttribute('aria-expanded')).toBe('true')
  expect(screen.queryByText('Body')).not.toBeNull()
})

test('opens when empty flips to false and keeps a manual collapse across re-renders', async () => {
  const { rerender } = render(
    <RecordGroup empty title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  expect(trigger().getAttribute('aria-expanded')).toBe('false')

  rerender(
    <RecordGroup empty={false} title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  await waitFor(() => expect(screen.queryByText('Body')).not.toBeNull())
  expect(trigger().getAttribute('aria-expanded')).toBe('true')

  fireEvent.click(trigger())
  await waitFor(() => expect(screen.queryByText('Body')).toBeNull())

  rerender(
    <RecordGroup empty={false} title="Details">
      <p>Body changed</p>
    </RecordGroup>,
  )

  expect(trigger().getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Body changed')).toBeNull()
})

test('keeps a manual collapse when a parent re-renders with the same empty value', async () => {
  function Parent() {
    const [count, setCount] = useState(0)
    return (
      <>
        <button onClick={() => setCount(count + 1)} type="button">
          Rerender {count}
        </button>
        <RecordGroup empty={false} title="Details">
          <p>Body</p>
        </RecordGroup>
      </>
    )
  }
  render(<Parent />)

  fireEvent.click(trigger())
  await waitFor(() => expect(screen.queryByText('Body')).toBeNull())
  fireEvent.click(screen.getByRole('button', { name: /Rerender/ }))

  expect(trigger().getAttribute('aria-expanded')).toBe('false')
})

test('renders actions and footer only when passed', () => {
  const { unmount } = mount()

  expect(
    document.querySelector('[data-slot="record-group-actions"]'),
  ).toBeNull()
  expect(document.querySelector('[data-slot="record-group-footer"]')).toBeNull()

  unmount()
  mount({ actions: <button type="button">Add</button>, footer: <p>Footer</p> })

  expect(
    document.querySelector('[data-slot="record-group-actions"]'),
  ).not.toBeNull()
  expect(
    document.querySelector('[data-slot="record-group-footer"]')?.textContent,
  ).toBe('Footer')
})

test('spreads the actions to the end by default', () => {
  mount({ actions: <button type="button">Add</button> })

  const header = document.querySelector('[data-slot="record-group-header"]')
  expect(header?.getAttribute('data-actions-align')).toBe('between')
  expect(header?.className.split(' ')).toContain('justify-between')
})

test('places the actions right after the title when aligned to start', () => {
  mount({
    actions: <button type="button">Add</button>,
    actionsAlign: 'start',
  })

  const header = document.querySelector('[data-slot="record-group-header"]')
  const classes = header?.className.split(' ')
  expect(header?.getAttribute('data-actions-align')).toBe('start')
  expect(classes).toContain('justify-start')
  expect(classes).toContain('gap-2')
  expect(classes).not.toContain('justify-between')
  expect([...(header?.children ?? [])].map((child) => child.tagName)).toEqual([
    'H2',
    'DIV',
  ])
})

test('renders the footer after the rows inside the panel', () => {
  mount({ footer: <p>Footer</p> })

  const panel = document.querySelector('[data-slot="collapsible-panel"]')
  const slots = [...(panel?.children ?? [])].map((child) =>
    child.getAttribute('data-slot'),
  )

  expect(slots).toEqual(['record-group-content', 'record-group-footer'])
})

test('keeps actions outside the trigger and visible when closed', async () => {
  mount({ actions: <button type="button">Add</button> })

  fireEvent.click(trigger())
  await waitFor(() => expect(screen.queryByText('Body')).toBeNull())

  const add = screen.getByRole('button', { name: 'Add' })
  expect(trigger().contains(add)).toBe(false)
})

test('hides the footer from the document, focus and accessibility tree when closed', async () => {
  mount({ footer: <button type="button">Save</button> })

  expect(screen.getByRole('button', { name: 'Save' })).not.toBeNull()

  fireEvent.click(trigger())

  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull(),
  )
  expect(document.querySelector('[data-slot="record-group-footer"]')).toBeNull()
  expect(screen.queryByText('Save')).toBeNull()
})

test('starts with the footer absent when defaultOpen is false', () => {
  mount({ defaultOpen: false, footer: <button type="button">Save</button> })

  expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
  expect(document.querySelector('[data-slot="record-group-footer"]')).toBeNull()
})

test('defaults to the plain variant and exposes the variant as data-variant', () => {
  const { unmount } = mount()

  expect(
    screen
      .getByRole('region', { name: 'Details' })
      .getAttribute('data-variant'),
  ).toBe('plain')

  unmount()
  mount({ variant: 'card' })

  expect(
    screen
      .getByRole('region', { name: 'Details' })
      .getAttribute('data-variant'),
  ).toBe('card')
})

test('inset frames the content in a card and keeps the header outside it', () => {
  mount({ variant: 'inset' })

  const region = screen.getByRole('region', { name: 'Details' })
  const content = region.querySelector(
    '[data-slot="record-group-content"]',
  ) as HTMLElement
  const header = region.querySelector(
    '[data-slot="record-group-header"]',
  ) as HTMLElement

  expect(region.getAttribute('data-variant')).toBe('inset')
  expect(region.className).not.toContain('border')
  expect(content.className).toContain('rounded-lg border bg-card')
  expect(content.className).not.toContain('divide')
  expect(content.className).not.toContain('after:')
  expect(content.contains(header)).toBe(false)
})

test('keeps the empty padding on every variant', async () => {
  for (const variant of ['card', 'inset', 'plain'] as const) {
    const { unmount } = mount({ empty: true, variant })
    fireEvent.click(trigger())
    const content = await waitFor(() => {
      const found = document.querySelector(
        '[data-slot="record-group-content"]',
      ) as HTMLElement
      expect(found).not.toBeNull()
      return found
    })

    expect(content.className).toContain('py-6')
    expect(content.className).not.toContain('py-1')
    unmount()
  }
})

test('names the region and the trigger with the full title, never truncated', () => {
  const title =
    'A title long enough that it wraps in the header instead of being cut'
  mount({ title })

  expect(screen.getByRole('region', { name: title })).not.toBeNull()
  expect(screen.getByRole('button', { name: title })).not.toBeNull()
})

test('does not touch the internal open state on the empty flip while controlled', () => {
  const { rerender } = render(
    <RecordGroup empty open title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  rerender(
    <RecordGroup empty={false} open title="Details">
      <p>Body</p>
    </RecordGroup>,
  )
  rerender(
    <RecordGroup empty={false} title="Details">
      <p>Body</p>
    </RecordGroup>,
  )

  expect(trigger().getAttribute('aria-expanded')).toBe('false')
})
