import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type InspectorControls,
  inspectorControlArgs,
  inspectorControlArgTypes,
} from './inspector-controls.ts'
import { desktop, InspectorFrame } from './inspector-frame.tsx'
import { ComposedInspector } from './inspector-layouts.tsx'

const meta = {
  args: inspectorControlArgs,
  argTypes: inspectorControlArgTypes,
  decorators: [InspectorFrame],
  globals: desktop,
  parameters: {
    controls: { exclude: ['disabledTabs', 'open', 'tab', 'unconnected'] },
    layout: 'padded',
  },
  render: (args) => <ComposedInspector {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Stories',
} satisfies Meta<InspectorControls>

export default meta

type Story = StoryObj<InspectorControls>

export const Default: Story = {}

export const StatusTab: Story = {
  args: { tab: 'status' },
  name: 'Status',
}

export const LogsTab: Story = {
  args: { tab: 'logs' },
  name: 'Logs',
}

export const Unconnected: Story = {
  args: { unconnected: true },
}

export const DisabledTabs: Story = {
  args: { disabledTabs: true },
}

export const Closed: Story = {
  args: { open: false },
}
