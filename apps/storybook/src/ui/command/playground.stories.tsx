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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedCommand {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Command/Playground',
} satisfies Meta<CommandControls>

export default meta

type Story = StoryObj<CommandControls>

export const Playground: Story = {}
