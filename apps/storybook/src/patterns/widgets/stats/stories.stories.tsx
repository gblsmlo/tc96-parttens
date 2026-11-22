import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatsCanvas } from './stats-canvas.tsx'
import {
  type StatsControls,
  statsControlArgs,
  statsControlArgTypes,
} from './stats-controls.ts'
import { ComposedMetric } from './stats-layouts.tsx'

const meta = {
  args: statsControlArgs,
  argTypes: statsControlArgTypes,
  decorators: [StatsCanvas],
  parameters: {
    controls: { exclude: ['change', 'tone'] },
    layout: 'padded',
  },
  render: (args) => <ComposedMetric {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Stats/Stories',
} satisfies Meta<StatsControls>

export default meta

type Story = StoryObj<StatsControls>

export const Default: Story = {}

export const TrendDown: Story = {
  args: { change: -0.043 },
  name: 'Trend down',
}

export const TrendFlat: Story = {
  args: { change: 0 },
  name: 'Trend flat',
}

export const Inverted: Story = {
  args: { tone: 'inverted' },
}
