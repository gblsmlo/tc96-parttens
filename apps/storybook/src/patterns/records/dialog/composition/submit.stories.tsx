import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog, type RecordDialogProps } from '@tc96/parttens'
import { useState } from 'react'
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

const openChange = fn<RecordDialogProps['onOpenChange']>()
const submit = fn<RecordDialogProps['onSubmit']>()

const openChanges = () => openChange.mock.calls.map(([next]) => next)

const settleWith = (settle: () => boolean | Promise<boolean>) => {
  openChange.mockClear()
  submit.mockReset()
  submit.mockImplementation(settle)
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

const typeDraft = async (canvasElement: HTMLElement) => {
  const input =
    await page(canvasElement).findByLabelText<HTMLInputElement>('Title')
  await userEvent.type(input, 'Draft title')
  return input
}

const saveButton = (canvasElement: HTMLElement) =>
  page(canvasElement).getByRole<HTMLButtonElement>('button', { name: /Save/ })

const formOf = (input: HTMLElement) => input.closest('form') as HTMLFormElement

const modEnter = (input: HTMLElement, key: 'metaKey' | 'ctrlKey') =>
  fireEvent.keyDown(input, { [key]: true, key: 'Enter' })

const dialogProps = {
  cancelLabel: 'Cancel',
  onOpenChange: openChange,
  onSubmit: submit,
  submitLabel: 'Save',
  submittingLabel: 'Saving',
  title: 'New card',
  titleAncestor: 'Acme',
}

function Session() {
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Reopen
      </button>
      {mounted ? (
        <RecordDialog {...dialogProps} open={open}>
          <input aria-label="Title" defaultValue="" />
          <button onClick={() => setOpen(false)} type="button">
            Close from parent
          </button>
          <button onClick={() => setMounted(false)} type="button">
            Unmount
          </button>
        </RecordDialog>
      ) : null}
    </>
  )
}

const closeAndReopen = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    page(canvasElement).getByRole('button', { name: 'Close from parent' }),
  )
  await waitFor(() =>
    expect(page(canvasElement).queryByRole('dialog')).toBeNull(),
  )
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Reopen' }),
  )
}

const meta = {
  args: { ...dialogProps, open: true },
  component: RecordDialog,
  render: (args) => (
    <RecordDialog {...args}>
      <input aria-label="Title" defaultValue="" />
    </RecordDialog>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Composition/Submit',
} satisfies Meta<typeof RecordDialog>

export default meta
type Story = StoryObj<typeof meta>

export const PreventsNativeSubmitAndClosesOnTrue: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => true)
    const input = await typeDraft(canvasElement)

    const notPrevented = fireEvent.submit(formOf(input))

    await expect(notPrevented).toBe(false)
    await waitFor(() => expect(openChanges()).toEqual([false]))
  },
}

export const StaysOpenOnFalse: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => false)
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(openChanges()).toEqual([])
    await expect(input).toHaveValue('Draft title')
  },
}

export const StaysOpenOnThrow: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => {
      throw new Error('boom')
    })
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(openChanges()).toEqual([])
    await expect(input).toHaveValue('Draft title')
  },
}

export const StaysOpenOnReject: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => Promise.reject(new Error('boom')))
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(openChanges()).toEqual([])
  },
}

export const KeepsFocusOnSubmitWhenThrowing: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => {
      throw new Error('boom')
    })
    await typeDraft(canvasElement)
    const save = saveButton(canvasElement)
    save.focus()

    await userEvent.click(save)

    await waitFor(() => expect(save).toBeEnabled())
    await expect(save).toHaveFocus()
  },
}

export const ReturnsFocusToSubmitWhenRejecting: Story = {
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => {
      ;(canvasElement.ownerDocument.activeElement as HTMLElement).blur()
      return pending.promise
    })
    await typeDraft(canvasElement)
    const save = saveButton(canvasElement)
    save.focus()

    await userEvent.click(save)

    await page(canvasElement).findByRole('button', { name: 'Saving' })
    await expect(save).not.toHaveFocus()
    pending.reject(new Error('boom'))
    await waitFor(() => expect(save).toBeEnabled())
    await waitFor(() => expect(save).toHaveFocus())
  },
}

export const LocksDismissalWhilePending: Story = {
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    await typeDraft(canvasElement)
    const screen = page(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    const submitting = await screen.findByRole('button', { name: 'Saving' })
    await expect(submitting).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    await expect(openChanges()).toEqual([])

    pending.resolve(true)
    await waitFor(() => expect(openChanges()).toEqual([false]))
  },
}

export const IgnoresSecondSubmitWhilePending: Story = {
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    const input = await typeDraft(canvasElement)

    fireEvent.submit(formOf(input))
    fireEvent.submit(formOf(input))

    await expect(submit).toHaveBeenCalledTimes(1)
    pending.resolve(false)
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(submit).toHaveBeenCalledTimes(1)
  },
}

export const ClosesThroughEscapeAndCancelWhenIdle: Story = {
  play: async ({ canvasElement }) => {
    settleWith(() => true)
    await typeDraft(canvasElement)

    await userEvent.keyboard('{Escape}')
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Cancel' }),
    )

    await expect(openChanges()).toEqual([false, false])
  },
}

export const NoCloseAfterUnmount: Story = {
  render: () => <Session />,
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Saving' })
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Unmount' }),
    )
    pending.resolve(true)
    await flush()

    await expect(openChanges()).toEqual([])
  },
}

export const ReopenIsNotLockedAndIgnoresLateSettlement: Story = {
  render: () => <Session />,
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Saving' })
    await closeAndReopen(canvasElement)

    const save = await page(canvasElement).findByRole('button', {
      name: 'Save',
    })
    await expect(save).toBeEnabled()
    pending.resolve(true)
    await flush()

    await expect(openChanges()).toEqual([])
    await expect(
      page(canvasElement).getByRole('dialog', { name: 'New card' }),
    ).toBeTruthy()
  },
}

export const ReopenAfterFailedSubmitIsNotPending: Story = {
  render: () => <Session />,
  play: async ({ canvasElement }) => {
    settleWith(() => false)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await closeAndReopen(canvasElement)

    const save = await page(canvasElement).findByRole('button', {
      name: 'Save',
    })
    await expect(save).toBeEnabled()
  },
}

export const SubmitDisabledBlocksTheSubmit: Story = {
  args: { submitDisabled: true },
  play: async ({ canvasElement }) => {
    settleWith(() => true)
    await typeDraft(canvasElement)
    const save = saveButton(canvasElement)

    await expect(save).toBeDisabled()
    fireEvent.click(save)
    await expect(submit).not.toHaveBeenCalled()
  },
}

export const ModEnterSubmitsWithMetaAndCtrl: Story = {
  args: { submitOnModEnter: true },
  play: async ({ canvasElement }) => {
    settleWith(() => false)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    modEnter(input, 'ctrlKey')
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(2))
  },
}

export const ModEnterIgnoredWithoutTheOption: Story = {
  args: { submitOnModEnter: false },
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')

    await expect(submit).not.toHaveBeenCalled()
  },
}

export const ModEnterIgnoredWhilePending: Story = {
  args: { submitOnModEnter: true },
  play: async ({ canvasElement }) => {
    const pending = deferred()
    settleWith(() => pending.promise)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1))
    modEnter(input, 'ctrlKey')
    await expect(submit).toHaveBeenCalledTimes(1)
    pending.resolve(false)
    await flush()
  },
}

export const ModEnterIgnoredWhileDisabled: Story = {
  args: { submitDisabled: true, submitOnModEnter: true },
  play: async ({ canvasElement }) => {
    settleWith(() => true)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await flush()

    await expect(submit).not.toHaveBeenCalled()
  },
}

export const KeepOpenOnSuccessResetsAndFocusesFirstField: Story = {
  args: { keepOpenOnSuccess: true },
  play: async ({ canvasElement }) => {
    settleWith(() => true)
    const input = await typeDraft(canvasElement)

    await expect(input).toHaveValue('Draft title')
    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(input).toHaveValue(''))
    await expect(input).toHaveFocus()
    await expect(openChanges()).toEqual([])
    await expect(
      page(canvasElement).getByRole('dialog', { name: 'New card' }),
    ).toBeTruthy()
  },
}

export const KeepOpenOnSuccessKeepsValuesOnFailure: Story = {
  args: { keepOpenOnSuccess: true },
  play: async ({ canvasElement }) => {
    settleWith(() => false)
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())

    await expect(input).toHaveValue('Draft title')
  },
}
