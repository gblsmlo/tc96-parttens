import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableCanvas } from './editable-canvas.tsx'
import { editableControlArgs } from './editable-controls.ts'
import { ComposedEditable } from './editable-layouts.tsx'

const meta = {
  decorators: [EditableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutTrigger: Story = {
  render: () => <ComposedEditable {...editableControlArgs} trigger={false} />,
}

export const WithoutToolbar: Story = {
  render: () => (
    <ComposedEditable {...editableControlArgs} editing toolbar={false} />
  ),
}

export const Field: Story = {
  render: () => <ComposedEditable {...editableControlArgs} field />,
}

export const MultilineField: Story = {
  render: () => (
    <ComposedEditable
      {...editableControlArgs}
      field
      multiline
      value="A field that keeps a longer text, wrapping onto as many lines as the text needs instead of scrolling sideways."
    />
  ),
}
