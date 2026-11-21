import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from '@tc96/ui/calendar'

const meta = {
  component: Calendar,
  tags: ['!autodocs', '!dev'],
  title: 'UI/Calendar/API Reference',
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => <Calendar {...args} />,
}
