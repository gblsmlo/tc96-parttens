import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableTextCanvas } from './editable-text-canvas.tsx'
import { editableTextControlArgs } from './editable-text-controls.ts'
import { ComposedEditableText } from './editable-text-layouts.tsx'

const meta = {
  decorators: [EditableTextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Editable Text/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Multiline: Story = {
  render: () => <ComposedEditableText {...editableTextControlArgs} multiline />,
}

export const ReadOnly: Story = {
  render: () => <ComposedEditableText {...editableTextControlArgs} readOnly />,
}
