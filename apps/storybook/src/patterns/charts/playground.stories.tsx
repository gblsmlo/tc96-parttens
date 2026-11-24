import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ChartsControls,
  chartsControlArgs,
  chartsControlArgTypes,
} from './charts-controls.ts'
import { AccountScatter, formatAccount } from './charts-layouts.tsx'

const meta = {
  args: chartsControlArgs,
  argTypes: chartsControlArgTypes,
  parameters: { layout: 'padded' },
  render: ({ formattedTooltip, maxRadius, minRadius, ...args }) => (
    <AccountScatter
      {...args}
      formatTooltip={formattedTooltip ? formatAccount : undefined}
      radiusRange={[minRadius, maxRadius]}
    />
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Charts/Playground',
} satisfies Meta<ChartsControls>

export default meta

type Story = StoryObj<ChartsControls>

export const Playground: Story = {}
