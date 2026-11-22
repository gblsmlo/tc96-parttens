import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AssignedControls,
  assignedControlArgs,
  assignedControlArgTypes,
} from './assigned-controls'
import { ComposedAssigned } from './assigned-layouts'

const meta = {
  args: assignedControlArgs,
  argTypes: assignedControlArgTypes,
  render: (args) => <ComposedAssigned {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Assigned/Playground',
} satisfies Meta<AssignedControls>

export default meta

type Story = StoryObj<AssignedControls>

export const Playground: Story = {}
