import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordConfirmDialog,
  type RecordConfirmDialogProps,
  type RecordDialogSettlement,
} from '@tc96/parttens'
import { useState } from 'react'
import {
  expect,
  fireEvent,
  fn,
  mocked,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const openChanges = (args: RecordConfirmDialogProps) =>
  mocked(args.onOpenChange).mock.calls.map(([next]) => next)

const settleWith = (
  args: RecordConfirmDialogProps,
  settle: () => RecordDialogSettlement,
) => {
  mocked(args.onOpenChange).mockClear()
  mocked(args.onConfirm).mockReset().mockImplementation(settle)
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

const confirmButton = (canvasElement: HTMLElement) =>
  page(canvasElement).getByRole<HTMLButtonElement>('button', {
    name: /Delete/,
  })

const SessionConfirmDialog = (props: Readonly<RecordConfirmDialogProps>) => {
  const [open, setOpen] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Reopen
      </button>
      <RecordConfirmDialog {...props} open={open}>
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
  args: {
    cancelLabel: 'Cancel',
    confirmingLabel: 'Deleting',
    confirmLabel: 'Delete',
    onConfirm: fn(),
    onOpenChange: fn(),
    open: true,
    title: 'Delete card?',
  },
  component: RecordConfirmDialog,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Behavior',
} satisfies Meta<typeof RecordConfirmDialog>

export default meta

type Story = StoryObj<typeof meta>

export const ConfirmClosesOnTrue: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(openChanges(args)).toEqual([false]))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
  },
}

export const ConfirmStaysOpenOnFalse: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
  },
}

export const ConfirmStaysOpenOnThrow: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => {
      throw new Error('boom')
    })

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
  },
}

export const ConfirmStaysOpenOnReject: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => Promise.reject(new Error('boom')))

    await userEvent.click(confirmButton(canvasElement))

    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
  },
}

export const ConfirmShowsPendingAndLocksDismissal: Story = {
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
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
    await expect(openChanges(args)).toEqual([])

    pending.resolve(true)
    await waitFor(() => expect(openChanges(args)).toEqual([false]))
  },
}

export const ConfirmIgnoresSecondClickWhilePending: Story = {
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    const button = confirmButton(canvasElement)

    await userEvent.click(button)
    await page(canvasElement).findByRole('button', { name: 'Deleting' })
    fireEvent.click(button)

    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
    pending.resolve(false)
    await waitFor(() => expect(confirmButton(canvasElement)).toBeEnabled())
    await expect(args.onConfirm).toHaveBeenCalledTimes(1)
  },
}

export const ConfirmShowsErrorAndReturnsFocus: Story = {
  args: { errorMessage: 'Could not delete the card.' },
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => {
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

export const ConfirmDisabledBlocksTheAction: Story = {
  args: { confirmDisabled: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    const button = confirmButton(canvasElement)

    await expect(button).toBeDisabled()
    fireEvent.click(button)

    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

export const ConfirmCancelAndEscapeCloseWhenIdle: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)

    await userEvent.keyboard('{Escape}')
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Cancel' }),
    )

    await expect(openChanges(args)).toEqual([false, false])
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

export const ConfirmDestructiveFocusesCancel: Story = {
  play: async ({ canvasElement }) => {
    const screen = page(canvasElement)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
    )
    await expect(screen.getByRole('alertdialog')).toHaveAttribute(
      'data-tone',
      'destructive',
    )
  },
}

export const ConfirmDefaultToneFocusesConfirm: Story = {
  args: { tone: 'default' },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(confirmButton(canvasElement)).toHaveFocus())
    await expect(page(canvasElement).getByRole('alertdialog')).toHaveAttribute(
      'data-tone',
      'default',
    )
  },
}

export const ConfirmBodyWithChildren: Story = {
  args: { children: <p>Choose a destination.</p> },
  play: async ({ canvasElement }) => {
    const dialog = page(canvasElement).getByRole('alertdialog')

    await expect(
      dialog.querySelector('[data-slot="record-confirm-dialog-body"]'),
    ).toHaveTextContent('Choose a destination.')
  },
}

export const ConfirmNoBodyWithoutChildren: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await page(canvasElement).findByRole('alertdialog')

    await expect(
      dialog.querySelector('[data-slot="record-confirm-dialog-body"]'),
    ).toBeNull()
  },
}

export const ConfirmReopenIgnoresLateSettlement: Story = {
  render: (args) => <SessionConfirmDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)

    await userEvent.click(confirmButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Deleting' })
    await closeAndReopen(canvasElement)

    const button = await page(canvasElement).findByRole('button', {
      name: 'Delete',
    })
    await expect(button).toBeEnabled()
    pending.resolve(true)
    await flush()

    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
    await expect(
      page(canvasElement).getByRole('alertdialog', { name: 'Delete card?' }),
    ).toBeTruthy()
  },
}
