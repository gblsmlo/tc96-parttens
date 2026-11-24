import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats6Controls,
  stats6ControlArgs,
  stats6ControlArgTypes,
} from './stats-6-controls.ts'
import { ComposedStats6 } from './stats-6-layouts.tsx'

const meta = {
  args: stats6ControlArgs,
  argTypes: stats6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats6/Playground',
} satisfies Meta<Stats6Controls>

export default meta

type Story = StoryObj<Stats6Controls>

export const Playground: Story = {}
