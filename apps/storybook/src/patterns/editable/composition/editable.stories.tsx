import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableInput,
  EditableLabel,
  EditablePreview,
  type EditableProps,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} from '@tc96/parttens'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const startEditing = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole('button', { name: 'Alpha' }))
  const input = canvas.getByRole('textbox', { name: 'Title' })
  await waitFor(() => expect(input).toHaveFocus())
  return input
}

const meta = {
  args: {
    defaultValue: 'Alpha',
    onCancel: fn(),
    onEdit: fn(),
    onSubmit: fn(),
    onValueChange: fn(),
  },
  component: Editable,
  parameters: { layout: 'padded' },
  render: (args: EditableProps) => (
    <Editable {...args}>
      <EditableLabel>Title</EditableLabel>
      <EditableArea>
        <EditablePreview />
        <EditableInput />
      </EditableArea>
      <EditableTrigger>Edit</EditableTrigger>
      <EditableToolbar>
        <EditableSubmit>Save</EditableSubmit>
        <EditableCancel>Cancel</EditableCancel>
      </EditableToolbar>
    </Editable>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Composition/Editable',
} satisfies Meta<typeof Editable>

export default meta
type Story = StoryObj<typeof meta>

export const SubmitsWithEnter: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Beta')
    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).toHaveBeenCalledWith('Beta')
    await expect(canvas.getByRole('button', { name: 'Beta' })).toBeVisible()
    await expect(canvas.queryByRole('textbox')).toBeNull()
  },
}

export const RequiredMarkerUsesDestructiveForeground: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText('Title')

    await expect(label).toHaveAttribute('data-required')
    await expect(label.className).toContain(
      'data-required:after:text-destructive-foreground',
    )
    await expect(label.className).not.toMatch(/after:text-destructive(?!-)/)
  },
}

export const CancelsWithEscape: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await startEditing(canvasElement)
    await userEvent.paste('Draft')
    await userEvent.keyboard('{Escape}')

    await expect(args.onCancel).toHaveBeenCalledTimes(1)
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
    await userEvent.click(canvasElement.ownerDocument.body)

    await expect(args.onSubmit).toHaveBeenCalledWith('Blurred')
    await expect(canvas.getByRole('button', { name: 'Blurred' })).toBeVisible()
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
    await expect(args.onEdit).toHaveBeenCalledTimes(1)
    await expect(canvas.getByRole('textbox', { name: 'Title' })).toBeVisible()
  },
}

export const DisabledPreventsEditing: Story = {
  args: { disabled: true },
  // WCAG 1.4.3 exempts inactive controls, but the disabled preview sets no aria-disabled, so axe still measures its 1.65:1 text.
  parameters: {
    a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const preview = canvas.getByRole('button', { name: 'Alpha' })

    await userEvent.click(preview)

    await expect(args.onEdit).not.toHaveBeenCalled()
    await expect(canvas.queryByRole('textbox')).toBeNull()
    await expect(preview).toHaveAttribute('data-disabled', '')
  },
}

export const ExposesValueToNativeForms: Story = {
  render: () => (
    <form>
      <Editable defaultValue="Form value" name="title">
        <EditableLabel>Title</EditableLabel>
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
      </Editable>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector<HTMLInputElement>(
      'input[type="hidden"][name="title"]',
    )

    await expect(field?.value).toBe('Form value')
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
