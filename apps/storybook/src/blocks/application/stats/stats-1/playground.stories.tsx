import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats1Controls,
  stats1ControlArgs,
  stats1ControlArgTypes,
} from './stats-1-controls.ts'
import { ComposedStats1 } from './stats-1-layouts.tsx'

const meta = {
  args: stats1ControlArgs,
  argTypes: stats1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats1/Playground',
} satisfies Meta<Stats1Controls>

export default meta

type Story = StoryObj<Stats1Controls>

export const Playground: Story = {}
