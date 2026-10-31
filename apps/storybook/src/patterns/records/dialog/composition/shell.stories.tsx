import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog, type RecordDialogProps } from '@tc96/parttens'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const openChange = fn<RecordDialogProps['onOpenChange']>()
const submit = fn<RecordDialogProps['onSubmit']>()

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const slotIn = (canvasElement: HTMLElement, selector: string) =>
  canvasElement.ownerDocument.querySelector<HTMLElement>(selector)

const findDialog = (canvasElement: HTMLElement) =>
  page(canvasElement).findByRole('dialog', { name: 'New card' })

const meta = {
  args: {
    cancelLabel: 'Cancel',
    onOpenChange: openChange,
    onSubmit: submit,
    open: true,
    submitLabel: 'Save',
    submittingLabel: 'Saving',
    title: 'New card',
    titleAncestor: 'Acme',
  },
  component: RecordDialog,
  render: (args) => (
    <RecordDialog {...args}>
      <input aria-label="Title" defaultValue="" />
    </RecordDialog>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Composition/Shell',
} satisfies Meta<typeof RecordDialog>

export default meta
type Story = StoryObj<typeof meta>

export const FieldsInsideAForm: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)

    await expect(dialog.querySelector('form')).toBeTruthy()
    await expect(
      page(canvasElement).getByRole('button', { name: 'Save' }),
    ).toHaveAttribute('type', 'submit')
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

export const NoTopActionsByDefault: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)

    await expect(
      slotIn(canvasElement, '[data-slot="dialog-actions"]'),
    ).toBeNull()
  },
}

export const TopActionsWhenGiven: Story = {
  args: {
    actions: (
      <button aria-label="Expand" type="button">
        +
      </button>
    ),
  },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const actions = slotIn(canvasElement, '[data-slot="dialog-actions"]')

    await expect(actions?.querySelector('button')).toHaveAttribute(
      'aria-label',
      'Expand',
    )
  },
}

export const SubmitTiedToTheFormFromOutside: Story = {
  play: async ({ canvasElement }) => {
    const input = await page(canvasElement).findByLabelText('Title')
    const form = input.closest('form') as HTMLFormElement

    await expect(
      page(canvasElement).getByRole('button', { name: 'Save' }),
    ).toHaveAttribute('form', form.id)
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

export const FooterStartBeforeTheButtons: Story = {
  args: { footerStart: <span>Create more</span> },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const start = slotIn(canvasElement, '[data-slot="dialog-footer-start"]')

    await expect(start?.textContent).toBe('Create more')
    await expect(
      start?.compareDocumentPosition(
        page(canvasElement).getByRole('button', { name: 'Save' }),
      ),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
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
    await expect(save.querySelector('kbd')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
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

export const NoPanelWithoutChildren: Story = {
  args: { submitLabel: 'Create', title: 'New record' },
  render: (args) => <RecordDialog {...args} />,
  play: async ({ canvasElement }) => {
    openChange.mockClear()
    submit.mockImplementation(() => true)
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

    await waitFor(() =>
      expect(openChange.mock.calls.map(([next]) => next)).toEqual([false]),
    )
  },
}

export const DefaultSizeIs2xl: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)

    await expect(dialog).toHaveAttribute('data-size', 'default')
    await expect(dialog.className.includes('max-w-2xl')).toBe(true)
  },
}

export const SmallSize: Story = {
  args: { size: 'small' },
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)

    await expect(dialog).toHaveAttribute('data-size', 'small')
    await expect(dialog.className.includes('max-w-md')).toBe(true)
  },
}

export const LargeSize: Story = {
  args: { size: 'large' },
  play: async ({ canvasElement }) => {
    const dialog = await findDialog(canvasElement)

    await expect(dialog).toHaveAttribute('data-size', 'large')
    await expect(dialog.className.includes('max-w-4xl')).toBe(true)
  },
}

export const StretchBodyMarksTheWrapper: Story = {
  args: { stretchBody: true },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const body = slotIn(canvasElement, '[data-slot="dialog-panel"]')

    await expect(body?.hasAttribute('data-stretch')).toBe(true)
    await expect(body?.className.includes('flex-1')).toBe(true)
    await expect(
      body?.contains(page(canvasElement).getByLabelText('Title')),
    ).toBe(true)
  },
}

export const NoStretchByDefault: Story = {
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)

    await expect(
      slotIn(canvasElement, '[data-slot="dialog-panel"]')?.hasAttribute(
        'data-stretch',
      ),
    ).toBe(false)
  },
}
