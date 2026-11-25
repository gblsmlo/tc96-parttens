import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateCanvas } from './date-canvas.tsx'
import { dateControlArgs } from './date-controls.ts'
import { ComposedDate } from './date-layouts.tsx'

const meta = {
  decorators: [DateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedDate {...dateControlArgs} />,
}
