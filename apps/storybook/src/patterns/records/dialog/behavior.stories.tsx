import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
  type RecordDialogProps,
  type RecordDialogSettlement,
  type RecordDialogSize,
  TextProperty,
  useRecordDraft,
} from '@tc96/parttens'
import { type FormEvent, useState } from 'react'
import {
  expect,
  fireEvent,
  fn,
  mocked,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

interface DraftValues {
  location: string | null
  title: string
}

type BehaviorArgs = RecordDialogProps & {
  onAction: () => void
  onCheckedChange: (checked: boolean) => void
  onSave: (values: DraftValues) => void
  onTitleChange: (title: string) => void
}

type Harness = Readonly<
  Omit<
    BehaviorArgs,
    'onAction' | 'onCheckedChange' | 'onSave' | 'onTitleChange'
  >
>

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const slotIn = (canvasElement: HTMLElement, selector: string) =>
  canvasElement.ownerDocument.querySelector<HTMLElement>(selector)

const findDialog = (canvasElement: HTMLElement) =>
  page(canvasElement).findByRole('dialog', { name: 'New card' })

const openChanges = (args: BehaviorArgs) =>
  mocked(args.onOpenChange).mock.calls.map(([next]) => next)

const settleWith = (
  args: BehaviorArgs,
  settle: (event: FormEvent<HTMLFormElement>) => RecordDialogSettlement,
) => {
  mocked(args.onOpenChange).mockClear()
  mocked(args.onSubmit).mockReset().mockImplementation(settle)
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

const FieldDialog = (props: Harness) => (
  <RecordDialog {...props}>
    <input aria-label="Title" defaultValue="" />
  </RecordDialog>
)

const SessionDialog = (props: Harness) => {
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Reopen
      </button>
      {mounted ? (
        <RecordDialog {...props} open={open}>
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

interface HeadlineDialogProps {
  descriptionField?: boolean
  onCheckedChange: (checked: boolean) => void
  onOpenChange: (open: boolean) => void
  onSubmit: RecordDialogProps['onSubmit']
  onTitleChange: (title: string) => void
  stretch?: boolean
}

const HeadlineDialog = ({
  descriptionField = true,
  onCheckedChange,
  onOpenChange,
  onSubmit,
  onTitleChange,
  stretch,
}: Readonly<HeadlineDialogProps>) => {
  const [title, setTitle] = useState('')
  const [createMore, setCreateMore] = useState(false)

  return (
    <RecordDialog
      footerStart={
        <RecordDialogCreateMore
          checked={createMore}
          label="Create more"
          onCheckedChange={(checked) => {
            setCreateMore(checked)
            onCheckedChange(checked)
          }}
        />
      }
      keepOpenOnSuccess={createMore}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      open
      stretchBody={stretch}
      submitLabel="Save"
      title="New card"
    >
      <RecordDialogHeadline
        descriptionLabel={descriptionField ? 'Description' : undefined}
        descriptionPlaceholder="Add description..."
        onTitleChange={(next) => {
          setTitle(next)
          onTitleChange(next)
        }}
        stretch={stretch}
        title={title}
        titleLabel="Card title"
        titlePlaceholder="Card title"
      />
    </RecordDialog>
  )
}

const DraftDialog = ({
  onOpenChange,
  onSave,
}: Readonly<Pick<BehaviorArgs, 'onOpenChange' | 'onSave'>>) => {
  const { draft, latest, update } = useRecordDraft<DraftValues>({
    location: null,
    title: '',
  })

  return (
    <RecordDialog
      onOpenChange={onOpenChange}
      onSubmit={() => {
        onSave(latest.current)
        return true
      }}
      open
      submitLabel="Save"
      submitOnModEnter
      title="New card"
    >
      <div className="grid gap-4">
        <RecordDialogHeadline
          onTitleChange={(title) => update({ title })}
          title={draft.title}
          titleLabel="Card title"
        />
        <TextProperty
          ariaLabel="Location"
          editing="inline"
          fallback="Add location"
          onCommit={(location) => update({ location })}
          value={draft.location}
        />
      </div>
    </RecordDialog>
  )
}

const expectedSize: Record<
  RecordDialogSize,
  { maxWidth: number; minHeight: string }
> = {
  default: { maxWidth: 672, minHeight: '0px' },
  large: { maxWidth: 896, minHeight: '544px' },
  small: { maxWidth: 448, minHeight: '0px' },
}

const expectSize = async (
  canvasElement: HTMLElement,
  size: RecordDialogSize,
) => {
  const { page: browser } = await import('vitest/browser')
  const { innerHeight, innerWidth } = window
  await browser.viewport(1280, 900)

  try {
    const dialog = await findDialog(canvasElement)
    const { maxWidth, minHeight } = expectedSize[size]

    await expect(dialog).toHaveAttribute('data-size', size)
    await expect(getComputedStyle(dialog).maxWidth).toBe(`${maxWidth}px`)
    await expect(getComputedStyle(dialog).minHeight).toBe(minHeight)
    await waitFor(() =>
      expect(dialog.getBoundingClientRect().width).toBe(maxWidth),
    )
  } finally {
    await browser.viewport(innerWidth, innerHeight)
  }
}

const meta = {
  args: {
    cancelLabel: 'Cancel',
    onAction: fn(),
    onCheckedChange: fn(),
    onOpenChange: fn(),
    onSave: fn(),
    onSubmit: fn(),
    onTitleChange: fn(),
    open: true,
    submitLabel: 'Save',
    submittingLabel: 'Saving',
    title: 'New card',
    titleAncestor: 'Acme',
  },
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <FieldDialog {...props} />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const PreventsNativeSubmitAndClosesOnTrue: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    const input = await typeDraft(canvasElement)

    const notPrevented = fireEvent.submit(formOf(input))

    await expect(notPrevented).toBe(false)
    await waitFor(() => expect(openChanges(args)).toEqual([false]))
  },
}

export const StaysOpenOnFalse: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
    await expect(input).toHaveValue('Draft title')
  },
}

export const StaysOpenOnThrow: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => {
      throw new Error('boom')
    })
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
    await expect(input).toHaveValue('Draft title')
  },
}

export const StaysOpenOnReject: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => Promise.reject(new Error('boom')))
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
    await expect(input).toHaveValue('Draft title')
  },
}

export const KeepsFocusOnSubmitWhenThrowing: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => {
      throw new Error('boom')
    })
    await typeDraft(canvasElement)
    const save = saveButton(canvasElement)
    save.focus()

    await userEvent.click(save)

    await waitFor(() => expect(save).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(save).toHaveFocus()
  },
}

export const ReturnsFocusToSubmitWhenRejecting: Story = {
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => {
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
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    const input = await typeDraft(canvasElement)
    const screen = page(canvasElement)

    await userEvent.click(saveButton(canvasElement))

    const submitting = await screen.findByRole('button', { name: 'Saving' })
    await expect(submitting).toBeDisabled()
    await expect(screen.getByRole('dialog')).toHaveAttribute('data-pending', '')
    await expect(formOf(input)).toHaveAttribute('aria-busy', 'true')
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    await expect(openChanges(args)).toEqual([])

    pending.resolve(true)
    await waitFor(() => expect(openChanges(args)).toEqual([false]))
  },
}

export const IgnoresSecondSubmitWhilePending: Story = {
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    const input = await typeDraft(canvasElement)

    fireEvent.submit(formOf(input))
    fireEvent.submit(formOf(input))

    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    pending.resolve(false)
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
  },
}

export const ClosesThroughEscapeAndCancelWhenIdle: Story = {
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    await typeDraft(canvasElement)

    await userEvent.keyboard('{Escape}')
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Cancel' }),
    )

    await expect(openChanges(args)).toEqual([false, false])
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const NoCloseAfterUnmount: Story = {
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <SessionDialog {...props} />
  ),
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Saving' })
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Unmount' }),
    )
    pending.resolve(true)
    await flush()

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
  },
}

export const ReopenIsNotLockedAndIgnoresLateSettlement: Story = {
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <SessionDialog {...props} />
  ),
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
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

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
    await expect(
      page(canvasElement).getByRole('dialog', { name: 'New card' }),
    ).toBeTruthy()
  },
}

export const ReopenAfterFailedSubmitIsNotPending: Story = {
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <SessionDialog {...props} />
  ),
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await closeAndReopen(canvasElement)

    const save = await page(canvasElement).findByRole('button', {
      name: 'Save',
    })
    await expect(save).toBeEnabled()
  },
}

export const SubmitDisabledBlocksTheSubmit: Story = {
  args: { submitDisabled: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    await typeDraft(canvasElement)
    const save = saveButton(canvasElement)

    await expect(save).toBeDisabled()
    fireEvent.click(save)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ModEnterSubmitsWithMetaAndCtrl: Story = {
  args: { submitOnModEnter: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    modEnter(input, 'ctrlKey')
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(2))
  },
}

export const ModEnterIgnoredWithoutTheOption: Story = {
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await flush()

    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ModEnterIgnoredWhilePending: Story = {
  args: { submitOnModEnter: true },
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledTimes(1))
    modEnter(input, 'ctrlKey')
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    pending.resolve(false)
    await flush()
  },
}

export const ModEnterIgnoredWhileDisabled: Story = {
  args: { submitDisabled: true, submitOnModEnter: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    const input = await typeDraft(canvasElement)

    modEnter(input, 'metaKey')
    await flush()

    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ModEnterHintAndShortcut: Story = {
  args: { submitOnModEnter: true },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const save = page(canvasElement).getByRole('button', { name: /Save/ })

    await expect(save).toHaveAttribute(
      'aria-keyshortcuts',
      'Meta+Enter Control+Enter',
    )
    await expect(
      save.querySelector('[data-slot="record-dialog-submit-hint"]'),
    ).toHaveAttribute('aria-hidden', 'true')
    await expect(save).toHaveAccessibleName('Save')
  },
}

export const NoModEnterHintByDefault: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const save = page(canvasElement).getByRole('button', { name: 'Save' })

    await expect(save.getAttribute('aria-keyshortcuts')).toBeNull()
    await expect(save.querySelector('kbd')).toBeNull()
  },
}

export const KeepOpenOnSuccessResetsAndFocusesFirstField: Story = {
  args: { keepOpenOnSuccess: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    const input = await typeDraft(canvasElement)

    await expect(input).toHaveValue('Draft title')
    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(input).toHaveValue(''))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(input).toHaveFocus()
    await expect(openChanges(args)).toEqual([])
    await expect(
      page(canvasElement).getByRole('dialog', { name: 'New card' }),
    ).toBeTruthy()
  },
}

export const KeepOpenOnSuccessKeepsValuesOnFailure: Story = {
  args: { keepOpenOnSuccess: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)
    const input = await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(input).toHaveValue('Draft title')
  },
}

export const FieldsInsideAForm: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)
    const form = dialog.querySelector('form')

    await expect(form).toHaveAttribute('data-slot', 'record-dialog-form')
    await expect(form?.contains(within(dialog).getByLabelText('Title'))).toBe(
      true,
    )
    await expect(
      page(canvasElement).getByRole('button', { name: 'Save' }),
    ).toHaveAttribute('type', 'submit')
  },
}

export const SubmitTiedToTheFormFromOutside: Story = {
  play: async ({ canvasElement }) => {
    const input = await page(canvasElement).findByLabelText('Title')
    const form = input.closest('form') as HTMLFormElement
    const save = page(canvasElement).getByRole('button', { name: 'Save' })

    await expect(save).toHaveAttribute('form', form.id)
    await expect(form.contains(save)).toBe(false)
  },
}

export const ErrorIsAnAlertAboveTheFooter: Story = {
  args: { errorMessage: 'Could not save' },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const alert = page(canvasElement).getByRole('alert')

    await expect(alert.textContent).toBe('Could not save')
    await expect(
      alert.compareDocumentPosition(
        page(canvasElement).getByRole('button', { name: 'Save' }),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const HeaderTrailAncestorBeforeTitle: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const trail = slotIn(canvasElement, '[data-slot="dialog-title-trail"]')

    await expect(trail?.textContent).toBe('AcmeNew card')
    await expect(trail?.firstElementChild?.textContent).toBe('Acme')
    await expect(trail?.lastElementChild?.textContent).toBe('New card')
    await expect(trail?.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  },
}

export const NamedByTheTitleOnly: Story = {
  play: async ({ canvasElement }) => {
    await expect(await findDialog(canvasElement)).toBeTruthy()
    await expect(
      page(canvasElement).queryByRole('dialog', { name: /Acme/ }),
    ).toBeNull()
    await expect(slotIn(canvasElement, 'nav')).toBeNull()
  },
}

export const OnlyTheTitleWithoutAncestor: Story = {
  args: { titleAncestor: undefined },
  play: async ({ canvasElement }) => {
    await expect(await findDialog(canvasElement)).toBeTruthy()
    await expect(
      slotIn(canvasElement, '[data-slot="dialog-title-trail"]'),
    ).toBeNull()
    await expect(
      slotIn(canvasElement, '[data-slot="dialog-header"] svg'),
    ).toBeNull()
  },
}

export const NoTopActionsByDefault: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)

    await expect(
      slotIn(canvasElement, '[data-slot="dialog-actions"]'),
    ).toBeNull()
  },
}

export const TopActionsWhenGiven: Story = {
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <FieldDialog
      {...props}
      actions={
        <button onClick={onAction} type="button">
          Expand
        </button>
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    const dialog = await findDialog(canvasElement)
    const actions = slotIn(canvasElement, '[data-slot="dialog-actions"]')
    if (!actions) throw new Error('The actions row did not render.')

    await expect(dialog.contains(actions)).toBe(true)
    await userEvent.click(
      within(actions).getByRole('button', { name: 'Expand' }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
  },
}

export const NoCancelWithoutCancelLabel: Story = {
  args: { cancelLabel: undefined },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)

    await expect(
      page(canvasElement).queryByRole('button', { name: 'Cancel' }),
    ).toBeNull()
    await expect(
      page(canvasElement).getByRole('button', { name: 'Save' }),
    ).toBeTruthy()
  },
}

export const FooterStartBeforeTheButtons: Story = {
  args: { footerStart: <span>Create more</span> },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const start = slotIn(canvasElement, '[data-slot="dialog-footer-start"]')

    await expect(start?.textContent).toBe('Create more')
    await expect(start?.parentElement).toHaveAttribute(
      'data-slot',
      'dialog-footer',
    )
    await expect(
      start?.compareDocumentPosition(
        page(canvasElement).getByRole('button', { name: 'Save' }),
      ),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  },
}

export const NoPanelWithoutChildren: Story = {
  args: { submitLabel: 'Create', title: 'New record' },
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <RecordDialog {...props} />
  ),
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    await page(canvasElement).findByRole('dialog', { name: 'New record' })

    await expect(slotIn(canvasElement, '[data-slot="dialog-panel"]')).toBeNull()
    await expect(
      slotIn(canvasElement, '[data-slot="dialog-header"]'),
    ).toBeTruthy()
    await expect(
      slotIn(canvasElement, '[data-slot="dialog-footer"]'),
    ).toBeTruthy()

    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Create' }),
    )

    await waitFor(() => expect(openChanges(args)).toEqual([false]))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}

export const DefaultSize: Story = {
  play: ({ canvasElement }) => expectSize(canvasElement, 'default'),
}

export const SmallSize: Story = {
  args: { size: 'small' },
  play: ({ canvasElement }) => expectSize(canvasElement, 'small'),
}

export const LargeSize: Story = {
  args: { size: 'large' },
  play: ({ canvasElement }) => expectSize(canvasElement, 'large'),
}

export const StretchBodyFillsThePopup: Story = {
  args: { stretchBody: true },
  render: ({ onAction, onCheckedChange, onSave, onTitleChange, ...props }) => (
    <RecordDialog {...props}>
      <input aria-label="Title" defaultValue="" />
      <p className="mt-auto text-sm">Pinned to the bottom</p>
    </RecordDialog>
  ),
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)
    const body = slotIn(canvasElement, '[data-slot="dialog-panel"]')
    if (!body) throw new Error('The body did not render.')
    const input = within(dialog).getByLabelText('Title')
    const pinned = within(dialog).getByText('Pinned to the bottom')

    await expect(body).toHaveAttribute('data-stretch')
    await expect(body.contains(input)).toBe(true)
    await expect(getComputedStyle(dialog).minHeight).toBe('384px')
    await expect(
      pinned.getBoundingClientRect().top - input.getBoundingClientRect().bottom,
    ).toBeGreaterThan(100)
    await expect(
      body.getBoundingClientRect().bottom -
        pinned.getBoundingClientRect().bottom,
    ).toBeLessThan(40)
  },
}

export const NoStretchByDefault: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)

    await expect(
      slotIn(canvasElement, '[data-slot="dialog-panel"]')?.hasAttribute(
        'data-stretch',
      ),
    ).toBe(false)
    await expect(getComputedStyle(dialog).minHeight).toBe('0px')
  },
}

export const HeadlineLabelsBothFields: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })
    const description = dialog.getByRole('textbox', { name: 'Description' })

    await expect(title).toHaveAttribute('name', 'title')
    await expect(description.tagName).toBe('TEXTAREA')
    await expect(description).toHaveAttribute('name', 'description')
    await expect(
      dialog.getByText('Card title', { selector: 'label' }),
    ).toHaveClass('sr-only')
  },
}

export const HeadlineAutofocusesTheTitle: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await waitFor(() =>
      expect(dialog.getByRole('textbox', { name: 'Card title' })).toHaveFocus(),
    )
  },
}

export const HeadlineTitleIsControlled: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })

    await userEvent.type(title, 'Ship it')

    await expect(title).toHaveValue('Ship it')
    await expect(args.onTitleChange).toHaveBeenLastCalledWith('Ship it')
  },
}

export const HeadlineTitleSpansTheRow: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })
    const headline = slotIn(
      canvasElement,
      '[data-slot="record-dialog-headline"]',
    )
    if (!headline) throw new Error('The headline did not render.')

    await waitFor(() => expect(title).toHaveFocus())
    await expect(title.getBoundingClientRect().width).toBe(
      headline.getBoundingClientRect().width,
    )
    await userEvent.tab()
    await expect(title).not.toHaveFocus()
    const box = title.getBoundingClientRect()
    await userEvent.pointer({
      coords: { clientX: box.right - 4, clientY: box.top + box.height / 2 },
      keys: '[MouseLeft]',
      target: title,
    })
    await expect(title).toHaveFocus()
  },
}

export const HeadlineWithoutDescription: Story = {
  render: (args) => <HeadlineDialog {...args} descriptionField={false} />,
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await expect(dialog.getAllByRole('textbox')).toHaveLength(1)
  },
}

export const HeadlineDescriptionMinHeight: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const description = dialog.getByRole('textbox', { name: 'Description' })

    await userEvent.type(description, 'Met the team at the October event.')

    await expect(description.getBoundingClientRect().height).toBeCloseTo(64, 0)
  },
}

export const HeadlineDescriptionReachesTheForm: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const descriptions: string[] = []
    settleWith(args, (event) => {
      descriptions.push(
        String(new FormData(event.currentTarget).get('description')),
      )
      return true
    })
    const dialog = within(await findDialog(canvasElement))

    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Description' }),
      'Referred by Renata Costa.',
    )
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(descriptions).toEqual(['Referred by Renata Costa.'])
  },
}

export const HeadlineStretch: Story = {
  render: (args) => <HeadlineDialog {...args} stretch />,
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const headline = slotIn(
      canvasElement,
      '[data-slot="record-dialog-headline"]',
    )

    await expect(headline).toHaveAttribute('data-stretch')
    await expect(headline?.className.includes('flex-1')).toBe(true)
  },
}

export const CreateMoreToggles: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const toggle = dialog.getByRole('switch', { name: 'Create more' })

    await expect(toggle).not.toBeChecked()
    await userEvent.click(dialog.getByText('Create more'))
    await expect(toggle).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false)
  },
}

export const CreateMoreKeepsTheDialogOpen: Story = {
  render: (args) => <HeadlineDialog {...args} />,
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })
    const description = dialog.getByRole('textbox', { name: 'Description' })

    await userEvent.click(dialog.getByRole('switch', { name: 'Create more' }))
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    await userEvent.type(title, 'First')
    await userEvent.type(description, 'The first card.')
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(title).toHaveFocus())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(description).toHaveValue('')
    await expect(args.onOpenChange).not.toHaveBeenCalledWith(false)
  },
}

export const RecordDraftReadsACommitInTheSameEvent: Story = {
  render: ({ onOpenChange, onSave }) => (
    <DraftDialog onOpenChange={onOpenChange} onSave={onSave} />
  ),
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Card title' }),
      'Quick sync',
    )
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Location' }),
      'Room 4',
    )
    await userEvent.keyboard('{Control>}{Enter}{/Control}')

    await waitFor(() =>
      expect(args.onSave).toHaveBeenCalledWith({
        location: 'Room 4',
        title: 'Quick sync',
      }),
    )
    await expect(args.onSave).toHaveBeenCalledOnce()
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false))
  },
}
