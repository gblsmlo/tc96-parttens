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
  render: (args) => <ComposedDate {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Playground',
} satisfies Meta<DateControls>

export default meta

type Story = StoryObj<DateControls>

export const Playground: Story = {}
