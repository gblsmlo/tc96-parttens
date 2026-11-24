import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats7Controls,
  stats7ControlArgs,
  stats7ControlArgTypes,
} from './stats-7-controls.ts'
import { ComposedStats7 } from './stats-7-layouts.tsx'

const meta = {
  args: stats7ControlArgs,
  argTypes: stats7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats7/Playground',
} satisfies Meta<Stats7Controls>

export default meta

type Story = StoryObj<Stats7Controls>

export const Playground: Story = {}
