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
  parameters: {
    controls: { exclude: ['size', 'value'] },
  },
  render: (args) => <ComposedEditableText {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Editable Text/Stories',
} satisfies Meta<EditableTextControls>

export default meta

type Story = StoryObj<EditableTextControls>

export const Default: Story = {}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const SizeXl: Story = {
  args: { size: 'xl' },
  name: 'Size xl',
}

export const Empty: Story = {
  args: { value: '' },
}
