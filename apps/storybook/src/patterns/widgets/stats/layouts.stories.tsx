import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsCanvas } from './stats-canvas.tsx'
import { statsControlArgs } from './stats-controls.ts'
import {
  AccentBorderCard,
  BreakdownCard,
  ComparisonCard,
  ComposedMetric,
  DonutCard,
  ProgressCard,
  StatusCard,
  ToggleCard,
} from './stats-layouts.tsx'

const meta = {
  decorators: [StatsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Stats/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithIcon: Story = {
  render: () => <ComposedMetric {...statsControlArgs} icon />,
}

export const WithSparkline: Story = {
  render: () => (
    <ComposedMetric
      {...statsControlArgs}
      changeLabel=""
      format="decimal"
      label="Active users"
      sparkline
      trend={false}
      value={2350}
    />
  ),
}

export const WithProgress: Story = {
  render: () => <ProgressCard />,
}

export const WithComparison: Story = {
  render: () => <ComparisonCard />,
}

export const WithBreakdown: Story = {
  render: () => <BreakdownCard />,
}

export const WithDonut: Story = {
  render: () => <DonutCard />,
}

export const WithStatus: Story = {
  render: () => (
    <div className="grid gap-4">
      <StatusCard label="API" />
      <StatusCard health="degraded" label="Database" uptime={0.982} />
      <StatusCard health="critical" label="Queue" uptime={0.874} />
    </div>
  ),
}

export const WithPeriodToggle: Story = {
  render: () => <ToggleCard />,
}

export const WithAccentBorder: Story = {
  render: () => <AccentBorderCard />,
}
