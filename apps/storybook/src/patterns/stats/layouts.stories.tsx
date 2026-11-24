import type { Meta, StoryObj } from '@storybook/react-vite'
import { AreaMetricWidget } from '@tc96/ui/patterns'
import { StatsCanvas } from './stats-canvas.tsx'
import { statsControlArgs } from './stats-controls.ts'
import {
  AccentBorderCard,
  ActionsCard,
  BreakdownCard,
  ComparisonCard,
  ComposedMetric,
  DonutCard,
  LeadsOverviewCard,
  PreviousPeriodCard,
  ProgressCard,
  StatusCard,
  ToggleCard,
} from './stats-layouts.tsx'

const meta = {
  decorators: [StatsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Stats/Layouts',
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

export const WithArea: Story = {
  render: () => (
    <AreaMetricWidget
      caption="store.example.com, 28 days"
      format={{ maximumFractionDigits: 1, notation: 'compact' }}
      label="Revenue"
      points={[1.8, 2.1, 1.9, 2.4, 2.2, 2.6, 2.3, 2.5, 2.9, 2.7, 3.1, 2.8]}
      value={62400}
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

export const WithActions: Story = {
  render: () => <ActionsCard />,
}

export const WithPreviousPeriod: Story = {
  render: () => <PreviousPeriodCard />,
}

export const WithLeadsOverview: Story = {
  parameters: { statsCanvas: 'wide' },
  render: () => <LeadsOverviewCard />,
}
