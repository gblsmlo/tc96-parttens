import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowShortcutsPopover } from '@tc96/parttens'
import { canvasControlArgs } from './canvas-controls.ts'
import { CanvasFrame } from './canvas-frame.tsx'
import { ComposedFlowCanvas } from './canvas-layouts.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutControls: Story = {
  decorators: [CanvasFrame],
  render: () => <ComposedFlowCanvas {...canvasControlArgs} controls={false} />,
}

export const WithoutShortcuts: Story = {
  decorators: [CanvasFrame],
  render: () => <ComposedFlowCanvas {...canvasControlArgs} shortcuts={false} />,
}

export const WithoutMinimap: Story = {
  decorators: [CanvasFrame],
  render: () => <ComposedFlowCanvas {...canvasControlArgs} minimap={false} />,
}

export const CanvasOnly: Story = {
  decorators: [CanvasFrame],
  render: () => (
    <ComposedFlowCanvas
      {...canvasControlArgs}
      controls={false}
      minimap={false}
    />
  ),
}

export const WithStepMenu: Story = {
  decorators: [CanvasFrame],
  render: () => <ComposedFlowCanvas {...canvasControlArgs} stepMenu />,
}

export const StandaloneShortcuts: Story = {
  render: () => <FlowShortcutsPopover />,
}
