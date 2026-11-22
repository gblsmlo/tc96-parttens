import type { Meta, StoryObj } from '@storybook/react-vite'
import { WidgetsCanvas } from './widgets-canvas.tsx'
import {
  type WidgetsControls,
  widgetsControlArgs,
  widgetsControlArgTypes,
} from './widgets-controls.ts'
import { ComposedWidget } from './widgets-layouts.tsx'

const meta = {
  args: widgetsControlArgs,
  argTypes: widgetsControlArgTypes,
  decorators: [WidgetsCanvas],
  parameters: {
    controls: {
      exclude: ['change', 'dimFraction', 'expanded', 'trendVariant'],
    },
    layout: 'padded',
  },
  render: (args) => <ComposedWidget {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Stories',
} satisfies Meta<WidgetsControls>

export default meta

type Story = StoryObj<WidgetsControls>

export const Default: Story = {}

export const TrendDown: Story = {
  args: { change: -0.043 },
  name: 'Trend down',
}

export const TrendFlat: Story = {
  args: { change: 0 },
  name: 'Trend flat',
}

export const TrendPlain: Story = {
  args: { trendVariant: 'plain' },
  name: 'Trend plain',
}

export const DimFraction: Story = {
  args: { dimFraction: true },
  name: 'dimFraction',
}

export const ListExpanded: Story = {
  args: { expanded: true },
  name: 'List expanded',
}
