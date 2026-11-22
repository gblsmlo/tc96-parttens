import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CanvasControls,
  canvasControlArgs,
  canvasControlArgTypes,
} from './canvas-controls.ts'
import { CanvasFrame } from './canvas-frame.tsx'
import { ComposedFlowCanvas } from './canvas-layouts.tsx'

const meta = {
  args: canvasControlArgs,
  argTypes: canvasControlArgTypes,
  decorators: [CanvasFrame],
  parameters: {
    controls: {
      exclude: ['direction', 'empty', 'loading', 'run', 'selected'],
    },
    layout: 'padded',
  },
  render: (args) => <ComposedFlowCanvas {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Stories',
} satisfies Meta<CanvasControls>

export default meta

type Story = StoryObj<CanvasControls>

export const Default: Story = {}

export const Vertical: Story = {
  args: { direction: 'vertical' },
}

export const Selected: Story = {
  args: { selected: true },
}

export const Succeeded: Story = {
  args: { run: 'success' },
}

export const Running: Story = {
  args: { run: 'running' },
}

export const NotRun: Story = {
  args: { run: 'not-run' },
}

export const Empty: Story = {
  args: { empty: true },
}

export const Loading: Story = {
  args: { loading: true },
}
