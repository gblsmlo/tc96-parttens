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
const { RecordDialog } = await import('./record-dialog')

afterEach(async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })
  cleanup()
})

function deferred() {
  let resolve: (value: boolean) => void = () => undefined
  let reject: (reason: unknown) => void = () => undefined
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, reject, resolve }
}

async function mount(
  onSubmit: () => boolean | Promise<boolean>,
  props: Partial<ComponentProps<typeof RecordDialog>> = {},
) {
  const changes: boolean[] = []
  const ui = (open: boolean) => (
    <RecordDialog
      cancelLabel="Cancel"
      onOpenChange={(next) => changes.push(next)}
      onSubmit={onSubmit}
      open={open}
      submitLabel="Save"
      submittingLabel="Saving"
      title="New card"
      titleAncestor="Acme"
      {...props}
    >
      <input aria-label="Title" defaultValue="" />
    </RecordDialog>
  )
  const view = await act(async () => render(ui(true)))
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Draft title' },
  })
  return {
    changes,
    setOpen: (open: boolean) =>
      act(async () => {
        view.rerender(ui(open))
      }),
    unmount: view.unmount,
  }
}

async function setup(
  onSubmit: () => boolean | Promise<boolean>,
  props: Partial<ComponentProps<typeof RecordDialog>> = {},
) {
  return (await mount(onSubmit, props)).changes
}

const flush = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))
const pressEscape = () => fireEvent.keyDown(document.body, { key: 'Escape' })

test('renders a dialog named by the title with the fields inside a form', async () => {
  await setup(() => true)

  const dialog = screen.getByRole('dialog', { name: 'New card' })
  expect(dialog.querySelector('form')).toBeTruthy()
  expect(
    screen.getByRole('button', { name: 'Save' }).getAttribute('type'),
  ).toBe('submit')
})

test('prevents the native submit and closes when the handler returns true', async () => {
  const changes = await setup(() => true)

  const form = screen.getByLabelText('Title').closest('form') as HTMLFormElement
  const notPrevented = fireEvent.submit(form)

  expect(notPrevented).toBe(false)
  await waitFor(() => expect(changes).toEqual([false]))
})

test('stays open and keeps the field value when the handler returns false', async () => {
  const changes = await setup(() => false)

  submit()

  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  )
  expect(changes).toEqual([])
  expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
    'Draft title',
  )
})

test('stays open when the handler throws', async () => {
  const changes = await setup(() => {
    throw new Error('boom')
  })

  submit()

  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  )
  expect(changes).toEqual([])
  expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
    'Draft title',
  )
})

test('stays open when the handler rejects', async () => {
  const changes = await setup(() => Promise.reject(new Error('boom')))

  submit()

  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  )
  expect(changes).toEqual([])
})

test('locks dismissal and buttons while the handler is pending', async () => {
  const pending = deferred()
  const changes = await setup(() => pending.promise)

  submit()

  const submitting = await screen.findByRole('button', { name: 'Saving' })
  expect((submitting as HTMLButtonElement).disabled).toBe(true)
  expect(
    (screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
  expect(
    (screen.getByRole('button', { name: 'Close' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true)
  pressEscape()
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(changes).toEqual([])

  pending.resolve(true)
  await waitFor(() => expect(changes).toEqual([false]))
})

test('ignores a second submit while pending', async () => {
  const pending = deferred()
  let calls = 0
  await setup(() => {
    calls += 1
    return pending.promise
  })

  const form = screen.getByLabelText('Title').closest('form') as HTMLFormElement
  fireEvent.submit(form)
  fireEvent.submit(form)

  expect(calls).toBe(1)
  pending.resolve(false)
  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'Saving' })).toBeNull(),
  )
})

test('closes through Escape and the cancel button when idle', async () => {
  const changes = await setup(() => true)

  pressEscape()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  expect(changes).toEqual([false, false])
})

test('announces the error message as an alert above the footer', async () => {
  await setup(() => false, { errorMessage: 'Could not save' })

  const alert = screen.getByRole('alert')
  expect(alert.textContent).toBe('Could not save')
  expect(
    alert.compareDocumentPosition(
      screen.getByRole('button', { name: 'Save' }),
    ) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
})

test('does not close after unmount when the handler resolves true', async () => {
  const pending = deferred()
  const { changes, unmount } = await mount(() => pending.promise)

  submit()
  await screen.findByRole('button', { name: 'Saving' })
  unmount()
  pending.resolve(true)
  await flush()

  expect(changes).toEqual([])
})

test('is not locked after a reopen and ignores the late settlement', async () => {
  const pending = deferred()
  const { changes, setOpen } = await mount(() => pending.promise)

  submit()
  await screen.findByRole('button', { name: 'Saving' })
  await setOpen(false)
  await setOpen(true)

  const save = await screen.findByRole('button', { name: 'Save' })
  expect((save as HTMLButtonElement).disabled).toBe(false)
  pending.resolve(true)
  await flush()

  expect(changes).toEqual([])
  expect(screen.getByRole('dialog', { name: 'New card' })).toBeTruthy()
})

test('is not pending after a reopen following a failed submit', async () => {
  const { setOpen } = await mount(() => false)

  submit()
  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  )
  await setOpen(false)
  await setOpen(true)

  const save = await screen.findByRole('button', { name: 'Save' })
  expect((save as HTMLButtonElement).disabled).toBe(false)
})

test('reads the header as a trail with the ancestor before the title', async () => {
  await setup(() => true)

  const trail = document.querySelector('[data-slot="dialog-title-trail"]')
  expect(trail?.textContent).toBe('AcmeNew card')
  expect(trail?.firstElementChild?.textContent).toBe('Acme')
  expect(trail?.lastElementChild?.textContent).toBe('New card')
  expect(trail?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
})

test('names the dialog by the title only', async () => {
  await setup(() => true)

  expect(screen.getByRole('dialog', { name: 'New card' })).toBeTruthy()
  expect(screen.queryByRole('dialog', { name: /Acme/ })).toBeNull()
  expect(document.querySelector('nav')).toBeNull()
})

test('draws the top actions only when given', async () => {
  await setup(() => true)
  expect(document.querySelector('[data-slot="dialog-actions"]')).toBeNull()
  cleanup()

  await setup(() => true, {
    actions: (
      <button aria-label="Expand" type="button">
        +
      </button>
    ),
  })
  const actions = document.querySelector('[data-slot="dialog-actions"]')
  expect(actions?.querySelector('button')?.getAttribute('aria-label')).toBe(
    'Expand',
  )
})

test('applies the size scale to the popup', async () => {
  await setup(() => true, { size: 'large' })

  expect(screen.getByRole('dialog').className.includes('max-w-4xl')).toBe(true)
})

test('keeps the submit button tied to the form outside of it', async () => {
  await setup(() => true)

  const form = screen.getByLabelText('Title').closest('form') as HTMLFormElement
  expect(
    screen.getByRole('button', { name: 'Save' }).getAttribute('form'),
  ).toBe(form.id)
})

test('renders no cancel button without a cancel label', async () => {
  await setup(() => true, { cancelLabel: undefined })

  expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
  expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy()
})

test('disables the submit button while submitDisabled is set', async () => {
  const calls: number[] = []
  await setup(
    () => {
      calls.push(1)
      return true
    },
    { submitDisabled: true },
  )

  const save = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement
  expect(save.disabled).toBe(true)
  fireEvent.click(save)
  expect(calls).toEqual([])
})

test('renders only the title without an ancestor', async () => {
  await setup(() => true, { titleAncestor: undefined })

  expect(screen.getByRole('dialog', { name: 'New card' })).toBeTruthy()
  expect(document.querySelector('[data-slot="dialog-title-trail"]')).toBeNull()
  expect(document.querySelector('[data-slot="dialog-header"] svg')).toBeNull()
})

test('renders the footer start slot before the buttons', async () => {
  await setup(() => true, { footerStart: <span>Create more</span> })

  const start = document.querySelector('[data-slot="dialog-footer-start"]')
  expect(start?.textContent).toBe('Create more')
  expect(
    start?.compareDocumentPosition(
      screen.getByRole('button', { name: 'Save' }),
    ),
  ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
})

const modEnter = (key: 'metaKey' | 'ctrlKey') =>
  fireEvent.keyDown(screen.getByLabelText('Title'), {
    [key]: true,
    key: 'Enter',
  })

test('submits with Meta+Enter and Ctrl+Enter when enabled', async () => {
  let calls = 0
  await setup(
    () => {
      calls += 1
      return false
    },
    { submitOnModEnter: true },
  )

  modEnter('metaKey')
  await waitFor(() => expect(calls).toBe(1))
  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: /Save/ }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  )
  modEnter('ctrlKey')
  await waitFor(() => expect(calls).toBe(2))
})

test('shows the hint and the shortcut attribute only when enabled', async () => {
  await setup(() => true, { submitOnModEnter: true })

  const save = screen.getByRole('button', { name: /Save/ })
  expect(save.getAttribute('aria-keyshortcuts')).toBe(
    'Meta+Enter Control+Enter',
  )
  expect(save.querySelector('kbd')?.getAttribute('aria-hidden')).toBe('true')
  cleanup()

  await setup(() => true)
  const plain = screen.getByRole('button', { name: 'Save' })
  expect(plain.getAttribute('aria-keyshortcuts')).toBeNull()
  expect(plain.querySelector('kbd')).toBeNull()
})

test('ignores Mod+Enter without the option, while pending and while disabled', async () => {
  let calls = 0
  const pending = deferred()
  await setup(
    () => {
      calls += 1
      return pending.promise
    },
    { submitOnModEnter: false },
  )
  modEnter('metaKey')
  expect(calls).toBe(0)
  cleanup()

  await setup(
    () => {
      calls += 1
      return pending.promise
    },
    { submitOnModEnter: true },
  )
  modEnter('metaKey')
  await waitFor(() => expect(calls).toBe(1))
  modEnter('ctrlKey')
  expect(calls).toBe(1)
  pending.resolve(false)
  await flush()
  cleanup()

  await setup(
    () => {
      calls += 1
      return true
    },
    { submitDisabled: true, submitOnModEnter: true },
  )
  modEnter('metaKey')
  await flush()
  expect(calls).toBe(1)
})

test('keeps the dialog open, resets the form and focuses the first field', async () => {
  const changes = await setup(() => true, { keepOpenOnSuccess: true })

  const input = screen.getByLabelText('Title') as HTMLInputElement
  expect(input.value).toBe('Draft title')
  submit()

  await waitFor(() => expect(input.value).toBe(''))
  expect(document.activeElement).toBe(input)
  expect(changes).toEqual([])
  expect(screen.getByRole('dialog', { name: 'New card' })).toBeTruthy()
})

test('keeps the values when keepOpenOnSuccess is set and the handler fails', async () => {
  await setup(() => false, { keepOpenOnSuccess: true })

  submit()
  await flush()

  expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
    'Draft title',
  )
})

test('renders no panel without children but keeps the header, footer and submit', async () => {
  const changes: boolean[] = []
  render(
    <RecordDialog
      cancelLabel="Cancel"
      onOpenChange={(next) => changes.push(next)}
      onSubmit={() => true}
      open
      submitLabel="Create"
      title="New record"
      titleAncestor="Acme"
    />,
  )

  expect(document.querySelector('[data-slot="dialog-panel"]')).toBeNull()
  expect(document.querySelector('[data-slot="dialog-header"]')).toBeTruthy()
  expect(document.querySelector('[data-slot="dialog-footer"]')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Create' }))
  await waitFor(() => expect(changes).toEqual([false]))
})

test('defaults to the default size with the 2xl width', async () => {
  await setup(() => true)

  const dialog = screen.getByRole('dialog')
  expect(dialog.getAttribute('data-size')).toBe('default')
  expect(dialog.className.includes('max-w-2xl')).toBe(true)
})

for (const [size, width] of [
  ['small', 'max-w-md'],
  ['default', 'max-w-2xl'],
  ['large', 'max-w-4xl'],
] as const) {
  test(`sets data-size and the width class for ${size}`, async () => {
    await setup(() => true, { size })

    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('data-size')).toBe(size)
    expect(dialog.className.includes(width)).toBe(true)
  })
}

test('marks the body wrapper as stretched only with stretchBody', async () => {
  await setup(() => true, { stretchBody: true })

  const body = document.querySelector('[data-slot="dialog-panel"]')
  expect(body?.hasAttribute('data-stretch')).toBe(true)
  expect(body?.className.includes('flex-1')).toBe(true)
  expect(body?.contains(screen.getByLabelText('Title'))).toBe(true)
  cleanup()

  await setup(() => true)
  expect(
    document
      .querySelector('[data-slot="dialog-panel"]')
      ?.hasAttribute('data-stretch'),
  ).toBe(false)
})
