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
  parameters: {
    controls: { exclude: ['disabled', 'readOnly', 'value', 'variant'] },
  },
  render: (args) => <ComposedAssigned {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Assigned/Variants',
} satisfies Meta<AssignedControls>

export default meta

type Story = StoryObj<AssignedControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { value: null },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
