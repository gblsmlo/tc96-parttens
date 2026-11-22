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
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFlowCanvas {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Playground',
} satisfies Meta<CanvasControls>

export default meta

type Story = StoryObj<CanvasControls>

export const Playground: Story = {}
