import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateCanvas } from './state-canvas.tsx'
import { stateControlArgs } from './state-controls.ts'
import { ComposedState, TwoActionsState } from './state-layouts.tsx'

const meta = {
  decorators: [StateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Surfaces/State/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithActions: Story = {
  render: () => <ComposedState {...stateControlArgs} actions state="error" />,
}

export const TwoActions: Story = {
  render: () => <TwoActionsState state="error" />,
}

export const FramedSurface: Story = {
  render: () => (
    <ComposedState
      {...stateControlArgs}
      actions
      actionLabel="Clear filters"
      className="rounded-xl border border-dashed"
      state="no-result"
    />
  ),
}

export const LoadingWithoutDescription: Story = {
  render: () => (
    <ComposedState
      {...stateControlArgs}
      description=""
      state="loading"
      title="Loading records"
    />
  ),
}
