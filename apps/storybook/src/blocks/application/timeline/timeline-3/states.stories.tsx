import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { timeline3ControlArgs } from './timeline-3-controls.ts'
import {
  ComposedTimeline3,
  type ComposedTimeline3Props,
} from './timeline-3-layouts.tsx'

const meta = {
  args: { ...timeline3ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline3/States',
} satisfies Meta<ComposedTimeline3Props>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { error: true },
}

export const Empty: Story = {
  args: { empty: true },
}
