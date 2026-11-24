import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowCanvas,
  FlowCanvasControls,
  FlowCanvasMinimap,
  type FlowConnection,
  FlowShortcutsPopover,
  type FlowStep,
  type FlowStepType,
} from '@tc96/ui/patterns'
import { Slot } from '../../../test-utils/anatomy-slot'
import { CanvasFrame } from './canvas-frame.tsx'

const stepTypes: FlowStepType[] = [
  { group: 'g', id: 'trigger', kind: 'trigger', label: 'stepTypes[0].label' },
  { group: 'g', id: 'action', kind: 'action', label: 'stepTypes[1].label' },
]

const steps: FlowStep[] = [
  {
    description: 'steps[0].description',
    id: 'first',
    name: 'steps[0].name',
    owner: { name: 'Owner Name' },
    position: { x: 0, y: 0 },
    run: { durationMs: 200, status: 'success' },
    type: 'trigger',
  },
  {
    description: 'steps[1].description',
    id: 'second',
    name: 'steps[1].name',
    position: { x: 520, y: 0 },
    run: { status: 'failed' },
    type: 'action',
  },
]

const connections: FlowConnection[] = [
  {
    id: 'first-second',
    label: 'connections[0].label',
    source: 'first',
    target: 'second',
    taken: true,
  },
]

const meta = {
  args: {
    connections,
    selectedStepId: 'second',
    stepTypes,
    steps,
  },
  component: FlowCanvas,
  decorators: [CanvasFrame],
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Flow/Canvas/API Reference',
} satisfies Meta<typeof FlowCanvas>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <FlowCanvas {...args}>
      <FlowCanvasControls>
        <FlowShortcutsPopover />
        <Slot name="children" />
      </FlowCanvasControls>
      <FlowCanvasMinimap />
    </FlowCanvas>
  ),
}
