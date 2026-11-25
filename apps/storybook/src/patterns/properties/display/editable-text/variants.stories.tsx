import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableTextCanvas } from './editable-text-canvas.tsx'
import {
  type EditableTextControls,
  editableTextControlArgs,
  editableTextControlArgTypes,
} from './editable-text-controls.ts'
import { ComposedEditableText } from './editable-text-layouts.tsx'

const meta = {
  args: editableTextControlArgs,
  argTypes: editableTextControlArgTypes,
  decorators: [EditableTextCanvas],
  render: (args) => <ComposedEditableText {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/EditableText/Variants',
} satisfies Meta<EditableTextControls>

export default meta

type Story = StoryObj<EditableTextControls>

export const Default: Story = {}

export const SizeSm: Story = {
  args: { size: 'sm' },
  parameters: { controls: { exclude: ['size'] } },
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  parameters: { controls: { exclude: ['size'] } },
}

export const SizeXl: Story = {
  args: { size: 'xl' },
  parameters: { controls: { exclude: ['size'] } },
}

export const Empty: Story = {
  args: { value: '' },
  parameters: { controls: { exclude: ['value'] } },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
  parameters: { controls: { exclude: ['readOnly'] } },
}
