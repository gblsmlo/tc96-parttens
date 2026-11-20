import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  args: { variant: 'outline' },
  component: Button,
  tags: ['!autodocs', '!dev'],
  title: 'UI/Button/API Reference',
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Button {...args}>
      <svg aria-hidden="true" data-anatomy="leading" viewBox="0 0 16 16">
        <rect
          fill="none"
          height="15"
          rx="3"
          stroke="currentColor"
          strokeDasharray="2 2"
          width="15"
          x="0.5"
          y="0.5"
        />
      </svg>
      <Slot name="children" />
    </Button>
  ),
}
