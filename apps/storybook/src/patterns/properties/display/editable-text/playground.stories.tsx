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
  title: 'Patterns/Properties/Display/Editable Text/Playground',
} satisfies Meta<EditableTextControls>

export default meta

type Story = StoryObj<EditableTextControls>

export const Playground: Story = {}
