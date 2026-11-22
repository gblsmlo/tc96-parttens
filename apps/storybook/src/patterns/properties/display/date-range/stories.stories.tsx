import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeCanvas } from './date-range-canvas.tsx'
import {
  type DateRangeControls,
  dateRangeControlArgs,
  dateRangeControlArgTypes,
} from './date-range-controls.ts'
import { ComposedDateRange } from './date-range-layouts.tsx'

const meta = {
  args: dateRangeControlArgs,
  argTypes: dateRangeControlArgTypes,
  decorators: [DateRangeCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'ends', 'variant'] },
  },
  render: (args) => <ComposedDateRange {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/DateRange/Stories',
} satisfies Meta<DateRangeControls>

export default meta

type Story = StoryObj<DateRangeControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const FromOnly: Story = {
  args: { ends: 'from' },
}

export const UntilOnly: Story = {
  args: { ends: 'until' },
}

export const Empty: Story = {
  args: { ends: 'none' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
