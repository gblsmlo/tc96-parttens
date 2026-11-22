import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowInspectorDetails, FlowInspectorStatus } from '@tc96/parttens'
import { inspectorControlArgs } from './inspector-controls.ts'
import {
  lastRun,
  logEntries,
  stepDetails,
  testRunStats,
} from './inspector-data.ts'
import { desktop, InspectorFrame, RendererFrame } from './inspector-frame.tsx'
import { ComposedInspector, LogsPanel } from './inspector-layouts.tsx'

const meta = {
  globals: desktop,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutHeaderActions: Story = {
  decorators: [InspectorFrame],
  render: () => (
    <ComposedInspector {...inspectorControlArgs} headerActions={false} />
  ),
}

export const WithoutIcon: Story = {
  decorators: [InspectorFrame],
  render: () => <ComposedInspector {...inspectorControlArgs} icon={false} />,
}

export const WithoutFooter: Story = {
  decorators: [InspectorFrame],
  render: () => <ComposedInspector {...inspectorControlArgs} footer={false} />,
}

export const StandaloneDetails: Story = {
  decorators: [RendererFrame],
  render: () => <FlowInspectorDetails items={stepDetails} />,
}

export const StandaloneStatus: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorStatus {...lastRun} stats={testRunStats} status="failed" />
  ),
}

export const StandaloneLogs: Story = {
  decorators: [RendererFrame],
  render: () => <LogsPanel entries={logEntries} stepId="send-email" />,
}
