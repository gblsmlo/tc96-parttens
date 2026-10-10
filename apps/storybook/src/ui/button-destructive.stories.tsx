import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'

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
    className: 'text-destructive-foreground',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story:
          'COSS has no destructive ghost variant. Patterns use the ghost variant with destructive text instead.',
      },
    },
  },
}

export const Outline: Story = {
  args: {
    variant: 'destructive-outline',
  },
}
