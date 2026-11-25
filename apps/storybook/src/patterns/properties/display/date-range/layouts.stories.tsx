import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeCanvas } from './date-range-canvas.tsx'
import { dateRangeControlArgs } from './date-range-controls.ts'
import { ComposedDateRange } from './date-range-layouts.tsx'

const meta = {
  decorators: [DateRangeCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/DateRange/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedDateRange {...dateRangeControlArgs} />,
}
