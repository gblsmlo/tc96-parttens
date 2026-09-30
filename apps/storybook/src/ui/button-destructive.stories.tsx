import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from 'tc96/ui'

const meta = {
  title: 'UI/Button/Destructive',
  component: Button,
  args: {
    children: 'Remove',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'destructive',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'destructive-ghost',
  },
}

export const Outline: Story = {
  args: {
    variant: 'destructive-outline',
  },
}
