import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CommandControls,
  commandControlArgs,
  commandControlArgTypes,
} from './command-controls.ts'
import { ComposedCommand } from './command-layouts.tsx'

const meta = {
  args: commandControlArgs,
  argTypes: commandControlArgTypes,
  parameters: {
    controls: { exclude: ['disabledItem', 'query'] },
    layout: 'centered',
  },
  render: (args) => <ComposedCommand {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Command/Stories',
} satisfies Meta<CommandControls>

export default meta

type Story = StoryObj<CommandControls>

export const Default: Story = {}

export const DisabledItem: Story = {
  args: { disabledItem: true },
}

export const Filtered: Story = {
  args: { query: 'cal' },
}

export const NoResults: Story = {
  args: { query: 'weather' },
}
