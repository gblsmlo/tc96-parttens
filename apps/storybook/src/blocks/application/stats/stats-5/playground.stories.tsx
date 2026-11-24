import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats5Controls,
  stats5ControlArgs,
  stats5ControlArgTypes,
} from './stats-5-controls.ts'
import { ComposedStats5 } from './stats-5-layouts.tsx'

const meta = {
  args: stats5ControlArgs,
  argTypes: stats5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats5/Playground',
} satisfies Meta<Stats5Controls>

export default meta

type Story = StoryObj<Stats5Controls>

export const Playground: Story = {}
