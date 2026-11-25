import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Flow3Controls,
  flow3ControlArgs,
  flow3ControlArgTypes,
} from './flow-3-controls.ts'
import { ComposedFlow3 } from './flow-3-layouts.tsx'

const meta = {
  args: flow3ControlArgs,
  argTypes: flow3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedFlow3
      {...args}
      onApprove={fn()}
      onReject={fn()}
      onReplay={fn()}
      onRetry={fn()}
    />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow3/Playground',
} satisfies Meta<Flow3Controls>

export default meta

type Story = StoryObj<Flow3Controls>

export const Playground: Story = {}
