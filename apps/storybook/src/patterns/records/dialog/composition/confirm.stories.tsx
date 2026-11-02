import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordConfirmDialog,
  type RecordConfirmDialogProps,
} from '@tc96/parttens'
import { useState } from 'react'
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

const openChange = fn<RecordConfirmDialogProps['onOpenChange']>()
const confirm = fn<RecordConfirmDialogProps['onConfirm']>()

const openChanges = () => openChange.mock.calls.map(([next]) => next)

const settleWith = (settle: () => boolean | Promise<boolean>) => {
  openChange.mockClear()
  confirm.mockReset()
  confirm.mockImplementation(settle)
}

function deferred() {
  let resolve: (value: boolean) => void = () => undefined
  let reject: (reason: unknown) => void = () => undefined
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, reject, resolve }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const confirmButton = (canvasElement: HTMLElement) =>
  page(canvasElement).getByRole<HTMLButtonElement>('button', {
    name: /Delete/,
  })

const dialogProps = {
  cancelLabel: 'Cancel',
  confirmingLabel: 'Deleting',
  confirmLabel: 'Delete',
  onConfirm: confirm,
  onOpenChange: openChange,
  title: 'Delete card?',
}

function Session() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Reopen
      </button>
      <RecordConfirmDialog {...dialogProps} open={open}>
        <button onClick={() => setOpen(false)} type="button">
          Close from parent
        </button>
      </RecordConfirmDialog>
    </>
  )
}

const closeAndReopen = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    page(canvasElement).getByRole('button', { name: 'Close from parent' }),
  )
  await waitFor(() =>
    expect(page(canvasElement).queryByRole('alertdialog')).toBeNull(),
  )
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Reopen' }),
  )
}

const meta = {
  args: { ...dialogProps, open: true },
  component: RecordConfirmDialog,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Composition/Confirm',
} satisfies Meta<typeof RecordConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const ClosesOnTrue: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => true)

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(openChanges()).toEqual([false]))
  },
}

export const StaysOpenOnFalse: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => false)

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(openChanges()).toEqual([])
  },
}

export const StaysOpenOnThrow: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => {
      throw new Error('boom')
    })

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(openChanges()).toEqual([])
  },
}

export const StaysOpenOnReject: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => Promise.reject(new Error('boom')))

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(openChanges()).toEqual([])
  },
}

export const ShowsPendingAndLocksDismissal: Story = {
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    const screen = page(canvasElement)

    await userEvent.click(confirmButton(canvasElement))

    const deleting = await screen.findByRole('button', { name: 'Deleting' })
    await expect(deleting).toBeDisabled()
    await expect(deleting.querySelector('[role="status"]')).toBeTruthy()
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await expect(screen.getByRole('alertdialog')).toHaveAttribute(
      'data-pending',
      '',
    )
    await expect(screen.getByRole('alertdialog')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await userEvent.keyboard('{Escape}')
    await expect(openChanges()).toEqual([])

    pending.resolve(true)
    await waitFor(() => expect(openChanges()).toEqual([false]))
  },
}

export const IgnoresSecondConfirmWhilePending: Story = {
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    const button = confirmButton(canvasElement)

    await userEvent.click(button)
    await page(canvasElement).findByRole('button', { name: 'Deleting' })
    fireEvent.click(button)

    await expect(confirm).toHaveBeenCalledTimes(1)
    pending.resolve(false)
    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(confirm).toHaveBeenCalledTimes(1)
  },
}

export const ShowsErrorAndReturnsFocusToConfirm: Story = {
  args: { errorMessage: 'Could not delete the card.' },
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => {
      ;(canvasElement.ownerDocument.activeElement as HTMLElement).blur()
      return pending.promise
    })
    const button = confirmButton(canvasElement)
    button.focus()

    await userEvent.click(button)

    await page(canvasElement).findByRole('button', { name: 'Deleting' })
    await expect(button).not.toHaveFocus()
    pending.reject(new Error('boom'))
    await waitFor(() => expect(button).toBeEnabled())
    await waitFor(() => expect(button).toHaveFocus())
    await expect(page(canvasElement).getByRole('alert')).toHaveTextContent(
      'Could not delete the card.',
    )
  },
}

export const DisabledConfirmBlocksTheAction: Story = {
  args: { confirmDisabled: true },
  play: async ({ canvasElement }) => {
    settleWith(() => true)
    const button = confirmButton(canvasElement)

    await expect(button).toBeDisabled()
    fireEvent.click(button)

    await expect(confirm).not.toHaveBeenCalled()
  },
}

export const CancelAndEscapeCloseWhenIdle: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => true)

    await userEvent.keyboard('{Escape}')
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Cancel' }),
    )

    await expect(openChanges()).toEqual([false, false])
    await expect(confirm).not.toHaveBeenCalled()
  },
}

export const FocusFollowsTone: Story = {
  play: async ({ canvasElement }) => {
    const screen = page(canvasElement)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
    )
  },
}

export const DefaultToneFocusesConfirm: Story = {
  args: { tone: 'default' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(confirmButton(canvasElement)).toHaveFocus())
    await expect(page(canvasElement).getByRole('alertdialog')).toHaveAttribute(
      'data-tone',
      'default',
    )
  },
}

export const RendersBodyOnlyWithChildren: Story = {
  args: { children: <p>Choose a destination.</p> },
  play: async ({ canvasElement }) => {
    const dialog = page(canvasElement).getByRole('alertdialog')

    await expect(
      dialog.querySelector('[data-slot="record-confirm-dialog-body"]'),
    ).toHaveTextContent('Choose a destination.')
  },
}

export const ReopenIsNotLockedAndIgnoresLateSettlement: Story = {
  render: () => <Session />,
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)

    await userEvent.click(confirmButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Deleting' })
    await closeAndReopen(canvasElement)

    const button = await page(canvasElement).findByRole('button', {
      name: 'Delete',
    })
    await expect(button).toBeEnabled()
    pending.resolve(true)
    await flush()

    await expect(openChanges()).toEqual([])
    await expect(
      page(canvasElement).getByRole('alertdialog', { name: 'Delete card?' }),
    ).toBeTruthy()
  },
}
