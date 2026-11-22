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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedEditable {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Editable/Playground',
} satisfies Meta<EditableControls>

export default meta

type Story = StoryObj<EditableControls>

export const Playground: Story = {}
