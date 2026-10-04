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

const { act, cleanup, fireEvent, render, screen, waitFor } = await import(
  '@testing-library/react'
)
const { SurfaceStates } = await import('./surface-states')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

function deferred() {
  let resolve: (value: boolean) => void = () => undefined
  const promise = new Promise<boolean>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

function mount(
  onConfirm: () => boolean | Promise<boolean>,
  props: Partial<ComponentProps<typeof SurfaceStates>> = {},
) {
  const changes: boolean[] = []
  const ui = (open: boolean) => (
    <SurfaceStates
      cancelLabel="Cancel"
      confirmLabel="Delete"
      confirmingLabel="Deleting"
      description="This cannot be undone."
      onConfirm={onConfirm}
      onOpenChange={(next) => changes.push(next)}
      open={open}
      title="Delete card"
      titleAncestor="Acme"
      {...props}
    />
  )
  const view = render(ui(true))
  return {
    changes,
    setOpen: (open: boolean) => view.rerender(ui(open)),
    unmount: view.unmount,
  }
}

function setup(
  onConfirm: () => boolean | Promise<boolean>,
  props: Partial<ComponentProps<typeof SurfaceStates>> = {},
) {
  return mount(onConfirm, props).changes
}

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

const confirm = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
const pressEscape = () => fireEvent.keyDown(document.body, { key: 'Escape' })
const idle = () =>
  waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Delete' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  )

test('renders an alertdialog named by the title and described by the description', () => {
  setup(() => true)

  const dialog = screen.getByRole('alertdialog', { name: 'Delete card' })
  expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
  expect(screen.getByText('This cannot be undone.')).toBeTruthy()
})

test('closes when the handler returns true', async () => {
  const changes = setup(() => true)

  confirm()

  await waitFor(() => expect(changes).toEqual([false]))
})

test('stays open when the handler returns false', async () => {
  const changes = setup(() => false)

  confirm()

  await idle()
  expect(changes).toEqual([])
})

test('stays open when the handler throws', async () => {
  const changes = setup(() => {
    throw new Error('boom')
  })

  confirm()

  await idle()
  expect(changes).toEqual([])
})

test('stays open when the handler rejects', async () => {
  const changes = setup(() => Promise.reject(new Error('boom')))

  confirm()

  await idle()
  expect(changes).toEqual([])
})

test('locks dismissal and buttons while the handler is pending', async () => {
  const pending = deferred()
  const changes = setup(() => pending.promise)

  confirm()

  const confirming = await screen.findByRole('button', { name: 'Deleting' })
  expect((confirming as HTMLButtonElement).disabled).toBe(true)
  expect(
    (screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
  pressEscape()
  expect(changes).toEqual([])

  pending.resolve(true)
  await waitFor(() => expect(changes).toEqual([false]))
})

test('closes through Escape and the cancel button when idle', () => {
  const changes = setup(() => true)

  pressEscape()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  expect(changes).toEqual([false, false])
})

test('announces the error message as an alert', () => {
  setup(() => false, { errorMessage: 'Could not delete' })

  expect(screen.getByRole('alert').textContent).toBe('Could not delete')
})

test('marks the dialog and the confirm button as destructive', () => {
  setup(() => true, { destructive: true })

  expect(screen.getByRole('alertdialog').hasAttribute('data-destructive')).toBe(
    true,
  )
  expect(screen.getByRole('button', { name: 'Delete' }).className).toContain(
    'bg-destructive',
  )
})

test('uses the default variant when not destructive', () => {
  setup(() => true)

  expect(screen.getByRole('alertdialog').hasAttribute('data-destructive')).toBe(
    false,
  )
  expect(
    screen.getByRole('button', { name: 'Delete' }).className,
  ).not.toContain('bg-destructive')
})

test('does not close after unmount when the handler resolves true', async () => {
  const pending = deferred()
  const { changes, unmount } = mount(() => pending.promise)

  confirm()
  await screen.findByRole('button', { name: 'Deleting' })
  unmount()
  pending.resolve(true)
  await flush()

  expect(changes).toEqual([])
})

test('is not locked after a reopen and ignores the late settlement', async () => {
  const pending = deferred()
  const { changes, setOpen } = mount(() => pending.promise)

  confirm()
  await screen.findByRole('button', { name: 'Deleting' })
  setOpen(false)
  setOpen(true)

  const button = await screen.findByRole('button', { name: 'Delete' })
  expect((button as HTMLButtonElement).disabled).toBe(false)
  pending.resolve(true)
  await flush()

  expect(changes).toEqual([])
  expect(screen.getByRole('alertdialog', { name: 'Delete card' })).toBeTruthy()
})

test('is not pending after a reopen following a failed confirm', async () => {
  const { setOpen } = mount(() => false)

  confirm()
  await idle()
  setOpen(false)
  setOpen(true)

  const button = await screen.findByRole('button', { name: 'Delete' })
  expect((button as HTMLButtonElement).disabled).toBe(false)
})

test('reads the header as a trail and names the dialog by the title only', () => {
  setup(() => true)

  const trail = document.querySelector('[data-slot="dialog-title-trail"]')
  expect(trail?.textContent).toBe('AcmeDelete card')
  expect(trail?.firstElementChild?.textContent).toBe('Acme')
  expect(trail?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  expect(screen.getByRole('alertdialog', { name: 'Delete card' })).toBeTruthy()
  expect(screen.queryByRole('alertdialog', { name: /Acme/ })).toBeNull()
  expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
})

test('renders only the title without an ancestor and applies the size', () => {
  setup(() => true, { size: 'large', titleAncestor: undefined })

  expect(document.querySelector('[data-slot="dialog-title-trail"]')).toBeNull()
  expect(screen.getByRole('alertdialog').className.includes('max-w-4xl')).toBe(
    true,
  )
})

test('defaults to the small size', () => {
  setup(() => true)

  const dialog = screen.getByRole('alertdialog')
  expect(dialog.getAttribute('data-size')).toBe('small')
  expect(dialog.className.includes('max-w-md')).toBe(true)
})
