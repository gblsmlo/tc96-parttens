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
  render: (args) => <ComposedDateRange {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/DateRange/Playground',
} satisfies Meta<DateRangeControls>

export default meta

type Story = StoryObj<DateRangeControls>

export const Playground: Story = {}
