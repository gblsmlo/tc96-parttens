import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats2Controls,
  stats2ControlArgs,
  stats2ControlArgTypes,
} from './stats-2-controls.ts'
import { ComposedStats2 } from './stats-2-layouts.tsx'

const meta = {
  args: stats2ControlArgs,
  argTypes: stats2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats2/Playground',
} satisfies Meta<Stats2Controls>

export default meta

type Story = StoryObj<Stats2Controls>

export const Playground: Story = {}
