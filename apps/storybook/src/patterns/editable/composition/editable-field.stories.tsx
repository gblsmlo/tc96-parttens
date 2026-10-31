import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Editable,
  EditableField,
  type EditableFieldProps,
  EditableLabel,
  type EditableProps,
} from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

type FieldStoryArgs = EditableProps & { field?: EditableFieldProps }

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

const meta = {
  args: {
    defaultValue: 'Alpha',
    onCancel: fn(),
    onEditingChange: fn(),
    onSubmit: fn(),
  },
  parameters: { layout: 'padded' },
  render: ({ field, ...args }: FieldStoryArgs) => (
    <Editable {...args}>
      <EditableLabel>Title</EditableLabel>
      <EditableField {...field} />
    </Editable>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Composition/Field',
} satisfies Meta<FieldStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const StaysMountedAndEditsWhileFocused: Story = {
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

export const SubmitsOnBlurOnlyWhenChanged: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(fieldOf(canvasElement))
    await blurAll(canvasElement)
    await expect(args.onSubmit).not.toHaveBeenCalled()

    await userEvent.click(fieldOf(canvasElement))
    await userEvent.clear(fieldOf(canvasElement))
    await userEvent.type(fieldOf(canvasElement), 'Beta')
    await blurAll(canvasElement)
    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    await expect(args.onSubmit).toHaveBeenCalledWith('Beta')
  },
}

export const SingleLineSubmitsOnceOnEnter: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(fieldOf(canvasElement))
    await userEvent.clear(fieldOf(canvasElement))
    await userEvent.type(fieldOf(canvasElement), 'Beta')
    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).toHaveBeenCalledTimes(1)
    await expect(args.onSubmit).toHaveBeenCalledWith('Beta')
    await expect(canvasElement.ownerDocument.activeElement).not.toBe(
      fieldOf(canvasElement),
    )
  },
}

export const MultilineLeavesEnterToTheField: Story = {
  args: { field: { multiline: true } },
  play: async ({ args, canvasElement }) => {
    await expect(fieldOf(canvasElement).tagName).toBe('TEXTAREA')

    await userEvent.click(fieldOf(canvasElement))
    await userEvent.clear(fieldOf(canvasElement))
    await userEvent.type(fieldOf(canvasElement), 'Beta')
    await userEvent.keyboard('{Enter}')

    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(fieldOf(canvasElement)).toHaveAttribute('data-editing')
  },
}

export const EscapeRestoresAndKeepsEventFromPage: Story = {
  play: async ({ args, canvasElement }) => {
    const page = listenOnDocument(canvasElement)
    try {
      await userEvent.click(fieldOf(canvasElement))
      await userEvent.clear(fieldOf(canvasElement))
      await userEvent.type(fieldOf(canvasElement), 'Draft')
      page.onDocumentKeyDown.mockClear()
      await userEvent.keyboard('{Escape}')

      await expect(fieldOf(canvasElement)).toHaveValue('Alpha')
      await expect(args.onCancel).toHaveBeenCalledTimes(1)
      await expect(args.onSubmit).not.toHaveBeenCalled()
      await expect(page.onDocumentKeyDown).not.toHaveBeenCalled()

      await userEvent.type(fieldOf(canvasElement), '{Escape}')

      await expect(page.onDocumentKeyDown).toHaveBeenCalledTimes(1)
    } finally {
      page.remove()
    }
  },
}

export const EmptyValueClearsOnFocusWithoutChange: Story = {
  args: {
    defaultValue: 'Untitled',
    field: { emptyValue: 'Untitled' },
  },
  play: async ({ args, canvasElement }) => {
    const page = listenOnDocument(canvasElement)
    try {
      await userEvent.click(fieldOf(canvasElement))
      await expect(fieldOf(canvasElement)).toHaveValue('')

      await userEvent.keyboard('{Escape}')
      await expect(page.onDocumentKeyDown).toHaveBeenCalledTimes(1)

      await blurAll(canvasElement)
      await expect(fieldOf(canvasElement)).toHaveValue('Untitled')
      await expect(args.onSubmit).not.toHaveBeenCalled()
    } finally {
      page.remove()
    }
  },
}

export const ReadOnlyRendersText: Story = {
  args: {
    defaultValue: '',
    field: { 'aria-label': 'Title', className: 'text-sm' },
    placeholder: 'No title',
    readOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('textbox')).toBeNull()
    const text = canvas.getByText('No title')
    await expect(text.tagName).toBe('SPAN')
    await expect(text).toHaveAttribute('data-slot', 'editable-field')
    await expect(text.className).toBe('text-sm')
  },
}

export const NamedByAriaLabelWithoutMissingLabel: Story = {
  render: () => (
    <Editable defaultValue="Alpha">
      <EditableField aria-label="Name" />
    </Editable>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Name' })

    await expect(input.hasAttribute('aria-labelledby')).toBe(false)
  },
}
