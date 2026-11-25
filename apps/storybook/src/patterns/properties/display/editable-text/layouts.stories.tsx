import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableTextCanvas } from './editable-text-canvas.tsx'
import { editableTextControlArgs } from './editable-text-controls.ts'
import { ComposedEditableText } from './editable-text-layouts.tsx'

const meta = {
  decorators: [EditableTextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/EditableText/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedEditableText {...editableTextControlArgs} />,
}

export const Multiline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A `textarea` in place of the single-line `input`, wrapping the text and growing with it, where Enter adds a line. For a text longer than one line, such as a description or a note.',
      },
    },
  },
  render: () => <ComposedEditableText {...editableTextControlArgs} multiline />,
}
