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
  parameters: { layout: 'padded' },
  render: (args) => <ComposedMetric {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Stats/Playground',
} satisfies Meta<StatsControls>

export default meta

type Story = StoryObj<StatsControls>

export const Playground: Story = {}
