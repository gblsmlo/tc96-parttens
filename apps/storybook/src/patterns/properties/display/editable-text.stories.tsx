import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableText } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'

const meta = {
  args: {
    ariaLabel: 'Title',
    onCommit: fn(),
    placeholder: 'Untitled',
    value: 'Check the contract signatures',
  },
  argTypes: {
    multiline: booleanArgType,
    readOnly: booleanArgType,
    revertWhenEmpty: booleanArgType,
    size: { control: 'inline-radio', options: ['sm', 'base', 'lg', 'xl'] },
    type: { control: 'inline-radio', options: ['text', 'email'] },
  },
  component: EditableText,
  parameters: {
    docs: {
      description: {
        component:
          'Text field edited in place. The keyboard contract is `Enter` to confirm (single line), `Escape` to discard the draft and `blur` to persist. The text scale is `size`; weight, family and width are left to whoever composes it.',
      },
    },
  },
  title: 'Patterns/Properties/Display/Editable Text',
} satisfies Meta<typeof EditableText>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: 'sm' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const field = canvas.getByLabelText<HTMLInputElement>('Title')
    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contract signed')
    await expect(args.onCommit).not.toHaveBeenCalled()

    await userEvent.tab()
    await expect(args.onCommit).toHaveBeenCalledWith('Contract signed')
  },
}

export const CommitsOnEnter: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: {
      description: {
        story:
          '`Enter` removes focus, and it is the `blur` that persists: the field commits exactly once, without relying on the keyboard and the pointer agreeing.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const field = canvas.getByLabelText<HTMLInputElement>('Title')
    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Contract signed{Enter}')

    await expect(args.onCommit).toHaveBeenCalledTimes(1)
    await expect(args.onCommit).toHaveBeenCalledWith('Contract signed')
  },
}

export const DiscardsOnEscape: Story = {
  args: { size: 'sm' },
  parameters: {
    docs: {
      description: {
        story:
          '`Escape` returns the draft to the confirmed value. Inside a dialog, the event only bubbles up when there is no draft to discard: the first `Escape` cancels the edit, the second closes the dialog.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const field = canvas.getByLabelText<HTMLInputElement>('Title')
    await userEvent.click(field)
    await userEvent.clear(field)
    await userEvent.type(field, 'Discarded draft{Escape}')

    await expect(field.value).toBe('Check the contract signatures')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const Multiline: Story = {
  args: {
    ariaLabel: 'Description',
    className: 'max-w-prose leading-relaxed',
    multiline: true,
    size: 'sm',
    placeholder: 'Add a description',
    value: 'The contract needs both signatures before Tuesday’s meeting.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Grows with its content through `field-sizing-content`, without measuring height in JavaScript. `Enter` breaks the line; the commit is left to `blur`.',
      },
    },
  },
}

export const RevertWhenEmpty: Story = {
  args: {
    emptyValue: 'Untitled',
    revertWhenEmpty: true,
    size: 'lg',
    value: 'Untitled',
  },
  parameters: {
    docs: {
      description: {
        story:
          'For a field the contract requires to be non-empty: an empty draft goes back to the confirmed value instead of committing `null`. `emptyValue` disappears on focus, so it is not erased character by character.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const field = canvas.getByLabelText<HTMLInputElement>('Title')
    await userEvent.click(field)
    await expect(field.value).toBe('')

    await userEvent.tab()
    await expect(field.value).toBe('Untitled')
    await expect(args.onCommit).not.toHaveBeenCalled()
  },
}

export const ReadOnly: Story = {
  args: {
    ariaLabel: 'Email',
    placeholder: 'No email',
    size: 'sm',
    readOnly: true,
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without write permission the field is not offered: the value becomes text, and the placeholder fills the absence.',
      },
    },
  },
}
