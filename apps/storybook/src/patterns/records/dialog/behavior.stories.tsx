import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordDialogSettlement,
  type RecordDialogSize,
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
import { recordDialogControlArgs } from './record-dialog-controls.ts'
import {
  ComposedRecordDialog,
  type ComposedRecordDialogProps,
  DescriptionOverBodyFormation,
  InlinePropertiesFormation,
  type ProjectDraft,
  PropertyBarOverBodyFormation,
  RowPropertiesFormation,
} from './record-dialog-layouts.tsx'

type BehaviorArgs = ComposedRecordDialogProps & {
  onCreateMoreChange: (checked: boolean) => void
  onOpenAsPage: () => void
  onOpenChange: (open: boolean) => void
  onSave: (values: Partial<ProjectDraft>) => void
  onSubmit: NonNullable<ComposedRecordDialogProps['onSubmit']>
  onTitleChange: (title: string) => void
}

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const slotIn = (canvasElement: HTMLElement, selector: string) =>
  canvasElement.ownerDocument.querySelector<HTMLElement>(selector)

const findDialog = (canvasElement: HTMLElement) =>
  page(canvasElement).findByRole('dialog', { name: 'New project' })

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
    await page(canvasElement).findByLabelText<HTMLInputElement>('Project title')
  await userEvent.type(input, 'Draft title')
  return input
}

const descriptionField = (canvasElement: HTMLElement) =>
  page(canvasElement).getByRole<HTMLTextAreaElement>('textbox', {
    name: 'Description',
  })

const saveButton = (canvasElement: HTMLElement) =>
  page(canvasElement).getByRole<HTMLButtonElement>('button', {
    name: /Create project/,
  })

const formOf = (input: HTMLElement) => input.closest('form') as HTMLFormElement

const modEnter = (input: HTMLElement, key: 'metaKey' | 'ctrlKey') =>
  fireEvent.keyDown(input, { [key]: true, key: 'Enter' })

const SessionHarness = ({
  ending,
  onSave,
  ...props
}: BehaviorArgs & { ending: 'close' | 'unmount' }) => {
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Reopen
      </button>
      {mounted ? (
        <ComposedRecordDialog
          {...props}
          actions
          onOpenAsPage={() =>
            ending === 'unmount' ? setMounted(false) : setOpen(false)
          }
          open={open}
        />
      ) : null}
    </>
  )
}

const leaveThroughOpenAsPage = (canvasElement: HTMLElement) =>
  userEvent.click(
    page(canvasElement).getByRole('button', { name: 'Open as page' }),
  )

const closeAndReopen = async (canvasElement: HTMLElement) => {
  await leaveThroughOpenAsPage(canvasElement)
  await waitFor(() =>
    expect(page(canvasElement).queryByRole('dialog')).toBeNull(),
  )
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Reopen' }),
  )
}

const DraftHarness = ({ onSave, ...props }: BehaviorArgs) => {
  const { latest, update } = useRecordDraft<Partial<ProjectDraft>>({})

  return (
    <ComposedRecordDialog
      {...props}
      onSubmit={() => {
        onSave(latest.current)
        return true
      }}
      onTitleChange={(title) => {
        props.onTitleChange?.(title)
        update({ title })
      }}
      submitOnModEnter
    >
      <RowPropertiesFormation onChange={update} />
    </ComposedRecordDialog>
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
    ...recordDialogControlArgs,
    onCreateMoreChange: fn(),
    onOpenAsPage: fn(),
    onOpenChange: fn(),
    onSave: fn(),
    onSubmit: fn(),
    onTitleChange: fn(),
    open: true,
  },
  render: ({ onSave, ...props }) => <ComposedRecordDialog {...props} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/RecordDialog/Behavior',
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

    await page(canvasElement).findByRole('button', { name: 'Creating' })
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

    const submitting = await screen.findByRole('button', { name: 'Creating' })
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
  render: (args) => <SessionHarness {...args} ending="unmount" />,
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Creating' })
    await leaveThroughOpenAsPage(canvasElement)
    pending.resolve(true)
    await flush()

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
  },
}

export const ReopenIsNotLockedAndIgnoresLateSettlement: Story = {
  render: (args) => <SessionHarness {...args} ending="close" />,
  play: async ({ args, canvasElement }) => {
    const pending = deferred()
    settleWith(args, () => pending.promise)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await page(canvasElement).findByRole('button', { name: 'Creating' })
    await closeAndReopen(canvasElement)

    const save = await page(canvasElement).findByRole('button', {
      name: 'Create project',
    })
    await expect(save).toBeEnabled()
    pending.resolve(true)
    await flush()

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(openChanges(args)).toEqual([])
    await expect(
      page(canvasElement).getByRole('dialog', { name: 'New project' }),
    ).toBeTruthy()
  },
}

export const ReopenAfterFailedSubmitIsNotPending: Story = {
  render: (args) => <SessionHarness {...args} ending="close" />,
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)
    await typeDraft(canvasElement)

    await userEvent.click(saveButton(canvasElement))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await closeAndReopen(canvasElement)

    const save = await page(canvasElement).findByRole('button', {
      name: 'Create project',
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

export const ModEnterShowsTheHintAndShortcut: Story = {
  args: { submitOnModEnter: true },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const save = saveButton(canvasElement)

    await expect(save).toHaveAttribute(
      'aria-keyshortcuts',
      'Meta+Enter Control+Enter',
    )
    await expect(
      save.querySelector('[data-slot="record-dialog-submit-hint"]'),
    ).toHaveAttribute('aria-hidden', 'true')
    await expect(save).toHaveAccessibleName('Create project')
  },
}

export const NoModEnterHintByDefault: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const save = page(canvasElement).getByRole('button', {
      name: 'Create project',
    })

    await expect(save.getAttribute('aria-keyshortcuts')).toBeNull()
    await expect(save.querySelector('kbd')).toBeNull()
  },
}

export const KeepOpenOnSuccessResetsAndFocusesFirstField: Story = {
  args: { keepOpenOnSuccess: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    await findDialog(canvasElement)
    const description = descriptionField(canvasElement)
    await userEvent.type(description, 'Draft description')

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(description).toHaveValue(''))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(
      page(canvasElement).getByRole('textbox', { name: 'Project title' }),
    ).toHaveFocus()
    await expect(openChanges(args)).toEqual([])
  },
}

export const KeepOpenOnSuccessKeepsValuesOnFailure: Story = {
  args: { keepOpenOnSuccess: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => false)
    await findDialog(canvasElement)
    const description = descriptionField(canvasElement)
    await userEvent.type(description, 'Draft description')

    await userEvent.click(saveButton(canvasElement))
    await waitFor(() => expect(saveButton(canvasElement)).toBeEnabled())

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(description).toHaveValue('Draft description')
  },
}

export const FieldsSitInsideAForm: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)
    const form = dialog.querySelector('form')

    await expect(form).toHaveAttribute('data-slot', 'record-dialog-form')
    await expect(
      form?.contains(within(dialog).getByLabelText('Project title')),
    ).toBe(true)
    await expect(saveButton(canvasElement)).toHaveAttribute('type', 'submit')
  },
}

export const SubmitTiedToTheFormFromOutside: Story = {
  play: async ({ canvasElement }) => {
    const input = await page(canvasElement).findByLabelText('Project title')
    const form = formOf(input)
    const save = saveButton(canvasElement)

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
      alert.compareDocumentPosition(saveButton(canvasElement)) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const HeaderTrailAncestorBeforeTitle: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const trail = slotIn(canvasElement, '[data-slot="dialog-title-trail"]')

    await expect(trail?.textContent).toBe('ProjectsNew project')
    await expect(trail?.firstElementChild?.textContent).toBe('Projects')
    await expect(trail?.lastElementChild?.textContent).toBe('New project')
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
      page(canvasElement).queryByRole('dialog', { name: /Projects/ }),
    ).toBeNull()
    await expect(slotIn(canvasElement, 'nav')).toBeNull()
  },
}

export const OnlyTheTitleWithoutAncestor: Story = {
  args: { titleAncestor: '' },
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
  args: { actions: true },
  play: async ({ args, canvasElement }) => {
    const dialog = await findDialog(canvasElement)
    const actions = slotIn(canvasElement, '[data-slot="dialog-actions"]')
    if (!actions) throw new Error('The actions row did not render.')

    await expect(dialog.contains(actions)).toBe(true)
    await userEvent.click(
      within(actions).getByRole('button', { name: 'Open as page' }),
    )
    await expect(args.onOpenAsPage).toHaveBeenCalledOnce()
  },
}

export const NoCancelWithoutCancelLabel: Story = {
  args: { cancelLabel: '' },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)

    await expect(
      page(canvasElement).queryByRole('button', { name: 'Cancel' }),
    ).toBeNull()
    await expect(saveButton(canvasElement)).toBeTruthy()
  },
}

export const FooterStartBeforeTheButtons: Story = {
  args: { createMore: true },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const start = slotIn(canvasElement, '[data-slot="dialog-footer-start"]')

    await expect(start?.textContent).toBe('Create more')
    await expect(start?.parentElement).toHaveAttribute(
      'data-slot',
      'dialog-footer',
    )
    await expect(
      start?.compareDocumentPosition(saveButton(canvasElement)),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  },
}

export const NoPanelWithoutChildren: Story = {
  args: { headline: false },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    await findDialog(canvasElement)

    await expect(slotIn(canvasElement, '[data-slot="dialog-panel"]')).toBeNull()
    await expect(
      slotIn(canvasElement, '[data-slot="dialog-header"]'),
    ).toBeTruthy()
    await expect(
      slotIn(canvasElement, '[data-slot="dialog-footer"]'),
    ).toBeTruthy()

    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(openChanges(args)).toEqual([false]))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
  },
}

export const DefaultSizeCapsTheWidthAt672: Story = {
  play: ({ canvasElement }) => expectSize(canvasElement, 'default'),
}

export const SmallSizeNarrowsThePopup: Story = {
  args: { size: 'small' },
  play: ({ canvasElement }) => expectSize(canvasElement, 'small'),
}

export const LargeSizeWidensThePopup: Story = {
  args: { size: 'large' },
  play: ({ canvasElement }) => expectSize(canvasElement, 'large'),
}

export const StretchBodyFillsThePopup: Story = {
  args: { stretchBody: true },
  render: ({ onSave, ...props }) => (
    <ComposedRecordDialog {...props}>
      <InlinePropertiesFormation />
    </ComposedRecordDialog>
  ),
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)
    const body = slotIn(canvasElement, '[data-slot="dialog-panel"]')
    if (!body) throw new Error('The body did not render.')
    const title = within(dialog).getByLabelText('Project title')
    const status = within(dialog).getByRole('combobox', { name: /^Status/ })

    await expect(body).toHaveAttribute('data-stretch')
    await expect(body.contains(title)).toBe(true)
    await expect(getComputedStyle(dialog).minHeight).toBe('384px')
    await expect(
      status.getBoundingClientRect().top - title.getBoundingClientRect().bottom,
    ).toBeGreaterThan(100)
    await expect(
      body.getBoundingClientRect().bottom -
        status.getBoundingClientRect().bottom,
    ).toBeLessThan(40)
  },
}

const propertyBarOf = async (canvasElement: HTMLElement) => {
  await findDialog(canvasElement)
  const bar = slotIn(canvasElement, '[data-slot="dialog-properties"]')
  if (!bar) throw new Error('The property bar did not render.')
  return bar
}

export const PropertiesSitUnderTheTitle: Story = {
  args: { properties: true },
  play: async ({ canvasElement }) => {
    const bar = await propertyBarOf(canvasElement)
    const header = slotIn(canvasElement, '[data-slot="dialog-header"]')

    const heading = slotIn(canvasElement, '[data-slot="dialog-heading"]')

    await expect(bar.parentElement).toBe(header)
    await expect(bar.previousElementSibling).toBe(heading)
    await expect(heading?.lastElementChild).toHaveAttribute(
      'data-slot',
      'dialog-title-trail',
    )
    await expect(getComputedStyle(bar).marginTop).toBe('8px')
    await expect(
      within(bar).getByRole('combobox', { name: /^Status/ }),
    ).toBeVisible()
  },
}

export const PropertiesSitUnderTheDescription: Story = {
  args: { description: 'Fill in the project.', properties: true },
  play: async ({ canvasElement }) => {
    const bar = await propertyBarOf(canvasElement)
    const heading = slotIn(canvasElement, '[data-slot="dialog-heading"]')
    const description = heading?.lastElementChild

    await expect(bar.previousElementSibling).toBe(heading)
    await expect(description).toHaveAttribute('data-slot', 'dialog-description')
    await expect(description).toHaveTextContent('Fill in the project.')
  },
}

export const NoPropertiesByDefault: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)

    await expect(
      slotIn(canvasElement, '[data-slot="dialog-properties"]'),
    ).toBeNull()
  },
}

export const DescriptionOverBodyHasNoHeadline: Story = {
  args: {
    description: 'Fill in the project before it goes live.',
    headline: false,
  },
  render: ({ onSave, ...props }) => (
    <ComposedRecordDialog {...props}>
      <DescriptionOverBodyFormation />
    </ComposedRecordDialog>
  ),
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const description = slotIn(
      canvasElement,
      '[data-slot="dialog-description"]',
    )
    const body = slotIn(canvasElement, '[data-slot="dialog-panel"]')
    if (!description || !body) throw new Error('The dialog did not render.')

    await expect(
      slotIn(canvasElement, '[data-slot="record-dialog-headline"]'),
    ).toBeNull()
    await expect(
      dialog.queryByRole('textbox', { name: 'Project title' }),
    ).toBeNull()
    await expect(
      dialog
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['New project'])
    await expect(description).toHaveTextContent(
      'Fill in the project before it goes live.',
    )
    await expect(body.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      description.getBoundingClientRect().bottom,
    )
    await expect(
      within(body).getByRole('combobox', { name: /^Status/ }),
    ).toBeVisible()
  },
}

export const ReadableBodyWidthCentersTheForm: Story = {
  args: { bodyWidth: 'readable', size: 'large', stretchBody: true },
  render: ({ onSave, ...props }) => (
    <ComposedRecordDialog {...props}>
      <PropertyBarOverBodyFormation />
    </ComposedRecordDialog>
  ),
  play: async ({ canvasElement }) => {
    const { page: browser } = await import('vitest/browser')
    const { innerHeight, innerWidth } = window
    await browser.viewport(1280, 900)

    try {
      await findDialog(canvasElement)
      const body = slotIn(canvasElement, '[data-slot="dialog-panel"]')
      const form = slotIn(canvasElement, '[data-slot="record-dialog-form"]')
      if (!body || !form) throw new Error('The body did not render.')

      await expect(form).toHaveAttribute('data-body-width', 'readable')
      await waitFor(() => expect(form.getBoundingClientRect().width).toBe(672))
      const panel = body.getBoundingClientRect()
      const column = form.getBoundingClientRect()
      await expect(column.left - panel.left).toBeCloseTo(
        panel.right - column.right,
        0,
      )
      await expect(
        page(canvasElement).getByRole('textbox', { name: 'Project brief' }),
      ).toBeVisible()
    } finally {
      await browser.viewport(innerWidth, innerHeight)
    }
  },
}

export const BodyFillsThePanelWidthByDefault: Story = {
  args: { size: 'large' },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const form = slotIn(canvasElement, '[data-slot="record-dialog-form"]')
    const body = slotIn(canvasElement, '[data-slot="dialog-panel"]')
    if (!body || !form) throw new Error('The body did not render.')

    await expect(form).toHaveAttribute('data-body-width', 'fill')
    await expect(getComputedStyle(form).maxWidth).toBe('none')
    await expect(form.getBoundingClientRect().width).toBeGreaterThan(
      body.getBoundingClientRect().width - 64,
    )
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
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Project title' })
    const description = dialog.getByRole('textbox', { name: 'Description' })

    await expect(title).toHaveAttribute('name', 'title')
    await expect(description.tagName).toBe('TEXTAREA')
    await expect(description).toHaveAttribute('name', 'description')
    await expect(
      dialog.getByText('Project title', { selector: 'label' }),
    ).toHaveClass('sr-only')
  },
}

export const HeadlineAutofocusesTheTitle: Story = {
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await waitFor(() =>
      expect(
        dialog.getByRole('textbox', { name: 'Project title' }),
      ).toHaveFocus(),
    )
  },
}

export const HeadlineTitleIsControlled: Story = {
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Project title' })

    await userEvent.type(title, 'Ship it')

    await expect(title).toHaveValue('Ship it')
    await expect(args.onTitleChange).toHaveBeenLastCalledWith('Ship it')
  },
}

export const HeadlineTitleSpansTheRow: Story = {
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Project title' })
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
  args: { headlineDescription: false },
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await expect(dialog.getAllByRole('textbox')).toHaveLength(1)
  },
}

export const HeadlineDescriptionStartsAtOneLine: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const description = descriptionField(canvasElement)
    const oneLine = description.getBoundingClientRect().height

    await expect(oneLine).toBeLessThan(40)

    await userEvent.type(description, 'Goal.{Enter}Scope.')

    await waitFor(() =>
      expect(description.getBoundingClientRect().height).toBeGreaterThan(
        oneLine,
      ),
    )
  },
}

export const HeadlineDescriptionReachesTheForm: Story = {
  play: async ({ args, canvasElement }) => {
    const descriptions: string[] = []
    settleWith(args, (event) => {
      descriptions.push(
        String(new FormData(event.currentTarget).get('description')),
      )
      return true
    })
    await findDialog(canvasElement)

    await userEvent.type(
      descriptionField(canvasElement),
      'Referred by Renata Costa.',
    )
    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(descriptions).toEqual(['Referred by Renata Costa.'])
  },
}

export const CreateMoreToggles: Story = {
  args: { createMore: true },
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const toggle = dialog.getByRole('switch', { name: 'Create more' })

    await expect(toggle).not.toBeChecked()
    await userEvent.click(dialog.getByText('Create more'))
    await expect(toggle).toBeChecked()
    await expect(args.onCreateMoreChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
    await expect(args.onCreateMoreChange).toHaveBeenLastCalledWith(false)
  },
}

export const CreateMoreKeepsTheDialogOpen: Story = {
  args: { createMore: true },
  play: async ({ args, canvasElement }) => {
    settleWith(args, () => true)
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Project title' })
    const description = descriptionField(canvasElement)

    await userEvent.click(dialog.getByRole('switch', { name: 'Create more' }))
    await expect(args.onCreateMoreChange).toHaveBeenLastCalledWith(true)
    await userEvent.type(title, 'First')
    await userEvent.type(description, 'The first project.')
    await userEvent.click(saveButton(canvasElement))

    await waitFor(() => expect(title).toHaveFocus())
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(description).toHaveValue('')
    await expect(args.onOpenChange).not.toHaveBeenCalledWith(false)
  },
}

export const RecordDraftReadsACommitInTheSameEvent: Story = {
  render: (args) => <DraftHarness {...args} />,
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Project title' }),
      'Quick sync',
    )
    await userEvent.type(
      dialog.getByRole('textbox', { name: 'Repository' }),
      'tc96/parttens',
    )
    await userEvent.keyboard('{Control>}{Enter}{/Control}')

    await waitFor(() =>
      expect(args.onSave).toHaveBeenCalledWith({
        repository: 'tc96/parttens',
        title: 'Quick sync',
      }),
    )
    await expect(args.onSave).toHaveBeenCalledOnce()
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false))
  },
}
