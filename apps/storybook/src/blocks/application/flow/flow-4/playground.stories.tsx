import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Flow4Controls,
  flow4ControlArgs,
  flow4ControlArgTypes,
} from './flow-4-controls.ts'
import { ComposedFlow4 } from './flow-4-layouts.tsx'

const meta = {
  args: flow4ControlArgs,
  argTypes: flow4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedFlow4 {...args} onNodeSelect={fn()} onRetry={fn()} />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow4/Playground',
} satisfies Meta<Flow4Controls>

export default meta

type Story = StoryObj<Flow4Controls>

export const Playground: Story = {}
