import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateCanvas } from './date-canvas.tsx'
import {
  type DateControls,
  dateControlArgs,
  dateControlArgTypes,
} from './date-controls.ts'
import { ComposedDate } from './date-layouts.tsx'

const meta = {
  args: dateControlArgs,
  argTypes: dateControlArgTypes,
  decorators: [DateCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'isOverdue', 'value', 'variant'] },
  },
  render: (args) => <ComposedDate {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Stories',
} satisfies Meta<DateControls>

export default meta

type Story = StoryObj<DateControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { value: '' },
}

export const Overdue: Story = {
  args: { isOverdue: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
