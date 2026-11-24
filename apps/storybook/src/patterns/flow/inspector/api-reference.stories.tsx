import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowInspector,
  FlowInspectorDetails,
  FlowInspectorLogs,
  FlowInspectorStatus,
} from '@tc96/ui/patterns'
import { IconSlot, Slot } from '../../../test-utils/anatomy-slot'
import { desktop, InspectorFrame, RendererFrame } from './inspector-frame.tsx'

const noop = () => {}

const meta = {
  args: {
    badge: <Slot name="badge" />,
    build: <Slot name="build" />,
    children: <Slot name="children" />,
    headerActions: <Slot name="headerActions" />,
    icon: <IconSlot />,
    onClose: noop,
    onTabChange: noop,
    open: true,
    tab: 'build',
    title: <Slot name="title" />,
    unconnected: true,
  },
  component: FlowInspector,
  globals: desktop,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Flow/Inspector/API Reference',
} satisfies Meta<typeof FlowInspector>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  decorators: [InspectorFrame],
}

export const DetailsAnatomy: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorDetails
      items={[
        { id: 'value', label: 'items[0].label', value: 'items[0].value' },
        { id: 'owner', label: 'items[1].label', owner: { name: 'Owner Name' } },
      ]}
    />
  ),
}

export const StatusAnatomy: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorStatus
      durationMs={1500}
      runId="runId"
      stats={{ completed: 3, entered: 4 }}
      status="success"
    />
  ),
}

export const LogsAnatomy: Story = {
  decorators: [RendererFrame],
  render: () => (
    <FlowInspectorLogs
      entries={[
        {
          description: 'entries[0].description',
          id: 'first',
          sequence: 1,
          status: 'success',
          stepId: 'first',
          stepName: 'entries[0].stepName',
        },
      ]}
      filter="step"
      onFilterChange={noop}
    />
  ),
}
