import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableText } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { EditableTextCanvas } from './editable-text-canvas.tsx'

const meta = {
  args: {
    ariaLabel: 'ariaLabel',
    onCommit: () => undefined,
    placeholder: 'placeholder',
    value: 'value',
  },
  component: EditableText,
  decorators: [EditableTextCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Editable Text/API Reference',
} satisfies Meta<typeof EditableText>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'ariaLabel' }),
    ).toHaveAttribute('data-slot', 'editable-text')
  },
}
