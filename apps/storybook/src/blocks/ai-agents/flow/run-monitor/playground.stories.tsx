import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RunMonitorControls,
  runMonitorControlArgs,
  runMonitorControlArgTypes,
} from './run-monitor-controls.ts'
import { ComposedRunMonitor } from './run-monitor-layouts.tsx'

const meta = {
  args: runMonitorControlArgs,
  argTypes: runMonitorControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedRunMonitor
      {...args}
      onApprove={fn()}
      onReject={fn()}
      onReplay={fn()}
      onRetry={fn()}
    />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/RunMonitor/Playground',
} satisfies Meta<RunMonitorControls>

export default meta

type Story = StoryObj<RunMonitorControls>

export const Playground: Story = {}
