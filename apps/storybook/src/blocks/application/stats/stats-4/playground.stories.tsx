import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Stats4Controls,
  stats4ControlArgs,
  stats4ControlArgTypes,
} from './stats-4-controls.ts'
import { ComposedStats4 } from './stats-4-layouts.tsx'

const meta = {
  args: stats4ControlArgs,
  argTypes: stats4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats4/Playground',
} satisfies Meta<Stats4Controls>

export default meta

type Story = StoryObj<Stats4Controls>

export const Playground: Story = {}
