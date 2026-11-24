import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats3Controls,
  stats3ControlArgs,
  stats3ControlArgTypes,
} from './stats-3-controls.ts'
import { ComposedStats3 } from './stats-3-layouts.tsx'

const meta = {
  args: stats3ControlArgs,
  argTypes: stats3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats3/Playground',
} satisfies Meta<Stats3Controls>

export default meta

type Story = StoryObj<Stats3Controls>

export const Playground: Story = {}
