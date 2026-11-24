import type { Meta, StoryObj } from '@storybook/react-vite'
import { Editable, EditableField } from '@tc96/ui/patterns'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { EditableCanvas } from './editable-canvas.tsx'
import { editableControlArgs } from './editable-controls.ts'
import {
  ComposedEditable,
  type ComposedEditableProps,
} from './editable-layouts.tsx'

const meta = {
  args: {
    ...editableControlArgs,
    onCancel: fn(),
    onEdit: fn(),
    onEditingChange: fn(),
    onSubmit: fn(),
    onValueChange: fn(),
    value: 'Alpha',
  },
  argTypes: {
    fieldProps: { control: false },
    onCancel: { control: false },
    onEdit: { control: false },
    onEditingChange: { control: false },
    onSubmit: { control: false },
    onValueChange: { control: false },
  },
  decorators: [EditableCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedEditable {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Behavior',
} satisfies Meta<ComposedEditableProps>

export default meta

type Story = StoryObj<ComposedEditableProps>

const startEditing = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole('button', { name: 'Alpha' }))
  const input = canvas.getByRole('textbox', { name: 'Title' })
  await waitFor(() => expect(input).toHaveFocus())
  return input
}

const fieldOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole<HTMLInputElement>('textbox', {
    name: 'Title',
  })

const blurAll = (canvasElement: HTMLElement) =>
  userEvent.click(canvasElement.ownerDocument.body)

const listenOnDocument = (canvasElement: HTMLElement) => {
  const onDocumentKeyDown = fn()
  canvasElement.ownerDocument.addEventListener('keydown', onDocumentKeyDown)
  return {
    onDocumentKeyDown,
    remove: () =>
      canvasElement.ownerDocument.removeEventListener(
        'keydown',
        onDocumentKeyDown,
      ),
  }
}

const colorOf = (canvasElement: HTMLElement, className: string) => {
  const probe = canvasElement.ownerDocument.createElement('span')
  probe.className = className
  canvasElement.append(probe)
  const { color } = getComputedStyle(probe)
  probe.remove()
  return color
}

export const PartsMountByState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Alpha' })).toBeVisible()
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(canvas.queryByRole('toolbar')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Edit' }))

    const toolbar = canvas.getByRole('toolbar')
    await expect(canvas.getByRole('textbox', { name: 'Title' })).toBeVisible()
    await expect(
      within(toolbar).getByRole('button', { name: 'Save' }),
    ).toBeVisible()
    await expect(
      within(toolbar).getByRole('button', { name: 'Cancel' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Alpha' })).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Edit' })).toBeNull()
  },
}

export const SubmitsWithEnter: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Beta')
    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Beta')
    await expect(canvas.getByRole('button', { name: 'Beta' })).toBeVisible()
    await expect(canvas.queryByRole('textbox')).toBeNull()
  },
}

export const EnterOnPreviewStartsEditing: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Alpha' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    const input = canvas.getByRole('textbox', { name: 'Title' })
    await waitFor(() => expect(input).toHaveFocus())
    await expect(input).toHaveValue('Alpha')
    await expect(args.onEdit).toHaveBeenCalledOnce()
  },
}

export const DoubleClickModeIgnoresSingleClick: Story = {
  args: { triggerMode: 'dblclick' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const preview = canvas.getByRole('button', { name: 'Alpha' })

    await userEvent.click(preview)
    await expect(args.onEdit).not.toHaveBeenCalled()

    await userEvent.dblClick(preview)
    await expect(args.onEdit).toHaveBeenCalledOnce()
    await expect(canvas.getByRole('textbox', { name: 'Title' })).toBeVisible()
  },
}

export const TriggerStartsWithCurrentValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Edit' }))

    await expect(canvas.getByRole('textbox', { name: 'Title' })).toHaveValue(
      'Alpha',
    )
  },
}

export const CancelsWithEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Draft')
    await userEvent.keyboard('{Escape}')

    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenCalledTimes(2)
    await expect(args.onValueChange).toHaveBeenNthCalledWith(1, 'Draft')
    await expect(args.onValueChange).toHaveBeenNthCalledWith(2, 'Alpha')
    await expect(canvas.getByRole('button', { name: 'Alpha' })).toBeVisible()
  },
}

export const SubmitsOnBlurOutsideActions: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Blurred')
    await blurAll(canvasElement)

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Blurred')
    await expect(canvas.getByRole('button', { name: 'Blurred' })).toBeVisible()
  },
}

export const SaveButtonSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Beta')
    await userEvent.tab()

    await expect(canvas.getByRole('button', { name: 'Save' })).toHaveFocus()
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Beta')
    await expect(canvas.getByRole('button', { name: 'Beta' })).toBeVisible()
  },
}

export const CancelButtonRestoresWithoutSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Draft')
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))

    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Alpha')
    await expect(canvas.getByRole('button', { name: 'Alpha' })).toBeVisible()
  },
}

export const RequiredMarkerUsesDestructiveForeground: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText('Title')
    const marker = getComputedStyle(label, '::after')
    const foreground = colorOf(canvasElement, 'text-destructive-foreground')
    const destructive = colorOf(canvasElement, 'text-destructive')

    await expect(label).toHaveAttribute('data-required')
    await expect(marker.content).toBe('"*"')
    await expect(foreground).not.toBe(destructive)
    await expect(marker.color).toBe(foreground)
  },
}

export const DisabledPreventsEditing: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const preview = canvas.getByRole('button', { name: 'Alpha' })

    await userEvent.click(preview)

    await expect(args.onEdit).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(preview).toHaveAttribute('data-disabled', '')
    await expect(preview).toHaveAttribute('aria-disabled', 'true')
    await expect(preview).not.toHaveAttribute('tabindex')
  },
}

export const ExposesValueToNativeForms: Story = {
  args: { name: 'title', value: 'Form value' },
  render: (args) => (
    <form onSubmit={(event) => event.preventDefault()}>
      <ComposedEditable {...args} />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')

    await expect(form ? new FormData(form).get('title') : null).toBe(
      'Form value',
    )
  },
}

export const FieldStaysMountedAndEditsWhileFocused: Story = {
  args: { field: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(fieldOf(canvasElement)).toHaveValue('Alpha')
    await expect(canvas.queryByRole('button')).toBeNull()

    await userEvent.click(fieldOf(canvasElement))
    await expect(fieldOf(canvasElement)).toHaveAttribute('data-editing')

    await blurAll(canvasElement)
    await expect(fieldOf(canvasElement)).not.toHaveAttribute('data-editing')
    await expect(args.onEditingChange).toHaveBeenCalledTimes(2)
    await expect(args.onEditingChange).toHaveBeenNthCalledWith(1, true)
    await expect(args.onEditingChange).toHaveBeenNthCalledWith(2, false)
  },
}

export const FieldSubmitsOnBlurOnlyWhenChanged: Story = {
  args: { field: true },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(fieldOf(canvasElement))
    await blurAll(canvasElement)
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.click(fieldOf(canvasElement))
    await userEvent.clear(fieldOf(canvasElement))
    await userEvent.type(fieldOf(canvasElement), 'Beta')
    await blurAll(canvasElement)
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Beta')
  },
}

export const SingleLineFieldSubmitsOnceOnEnter: Story = {
  args: { field: true },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(fieldOf(canvasElement))
    await userEvent.clear(fieldOf(canvasElement))
    await userEvent.type(fieldOf(canvasElement), 'Beta')
    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Beta')
    await expect(fieldOf(canvasElement)).not.toHaveFocus()
  },
}

export const MultilineFieldLeavesEnterToTheField: Story = {
  args: { field: true, multiline: true },
  play: async ({ args, canvasElement }) => {
    await expect(fieldOf(canvasElement).tagName).toBe('TEXTAREA')

    await userEvent.click(fieldOf(canvasElement))
    await userEvent.clear(fieldOf(canvasElement))
    await userEvent.type(fieldOf(canvasElement), 'Beta')
    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(fieldOf(canvasElement)).toHaveAttribute('data-editing')
    await expect(fieldOf(canvasElement)).toHaveValue('Beta\n')
  },
}

export const FieldEscapeRestoresAndKeepsEventFromPage: Story = {
  args: { field: true },
  play: async ({ args, canvasElement }) => {
    const page = listenOnDocument(canvasElement)
    try {
      await userEvent.click(fieldOf(canvasElement))
      await userEvent.clear(fieldOf(canvasElement))
      await userEvent.type(fieldOf(canvasElement), 'Draft')
      page.onDocumentKeyDown.mockClear()
      await userEvent.keyboard('{Escape}')

      await expect(fieldOf(canvasElement)).toHaveValue('Alpha')
      await expect(args.onCancel).toHaveBeenCalledOnce()
      await expect(args.onSubmit).not.toHaveBeenCalled()
      await expect(page.onDocumentKeyDown).not.toHaveBeenCalled()

      await userEvent.type(fieldOf(canvasElement), '{Escape}')

      await expect(page.onDocumentKeyDown).toHaveBeenCalledOnce()
    } finally {
      page.remove()
    }
  },
}

export const FieldEmptyValueClearsOnFocusWithoutChange: Story = {
  args: {
    field: true,
    fieldProps: { emptyValue: 'Untitled' },
    value: 'Untitled',
  },
  play: async ({ args, canvasElement }) => {
    const page = listenOnDocument(canvasElement)
    try {
      await userEvent.click(fieldOf(canvasElement))
      await expect(fieldOf(canvasElement)).toHaveValue('')

      await userEvent.keyboard('{Escape}')
      await expect(page.onDocumentKeyDown).toHaveBeenCalledOnce()

      await blurAll(canvasElement)
      await expect(fieldOf(canvasElement)).toHaveValue('Untitled')
      await expect(args.onSubmit).not.toHaveBeenCalled()
    } finally {
      page.remove()
    }
  },
}

export const ReadOnlyFieldRendersText: Story = {
  args: {
    field: true,
    fieldProps: { 'aria-label': 'Title', className: 'text-sm' },
    placeholder: 'No title',
    readOnly: true,
    value: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('textbox')).toBeNull()
    const text = canvas.getByText('No title')
    await expect(text.tagName).toBe('SPAN')
    await expect(text).toHaveAttribute('data-slot', 'editable-field')
    await expect(text).toHaveAttribute('data-readonly', '')
    await expect(text.className).toBe('text-sm')
  },
}

export const FieldNamedByAriaLabelWithoutMissingLabel: Story = {
  render: () => (
    <Editable defaultValue="Alpha">
      <EditableField aria-label="Name" />
    </Editable>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Name' })

    await expect(input).not.toHaveAttribute('aria-labelledby')
  },
}
