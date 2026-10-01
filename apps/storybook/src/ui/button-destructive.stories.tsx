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
  // O variant destructive do COSS pinta branco sobre red-500, com contraste de
  // 3,8:1. O COSS não é alterado aqui.
  parameters: {
    a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
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
