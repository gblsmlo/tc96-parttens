import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableCanvas } from './editable-canvas.tsx'
import {
  type EditableControls,
  editableControlArgs,
  editableControlArgTypes,
} from './editable-controls.ts'
import { ComposedEditable } from './editable-layouts.tsx'

const meta = {
  args: editableControlArgs,
  argTypes: editableControlArgTypes,
  decorators: [EditableCanvas],
  parameters: {
    controls: {
      exclude: [
        'disabled',
        'editing',
        'field',
        'multiline',
        'readOnly',
        'required',
        'value',
      ],
    },
    layout: 'centered',
  },
  render: (args) => <ComposedEditable {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Stories',
} satisfies Meta<EditableControls>

export default meta

type Story = StoryObj<EditableControls>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: '' },
}

export const Editing: Story = {
  args: { editing: true },
}

export const Required: Story = {
  args: { required: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
