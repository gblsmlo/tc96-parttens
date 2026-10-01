import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Continue',
    onClick: fn(),
  },
  argTypes: {
    size: {
      control: 'select',
      description: 'Controls the button height and horizontal padding.',
      options: [
        'xs',
        'sm',
        'default',
        'lg',
        'xl',
        'icon-xs',
        'icon-sm',
        'icon',
        'icon-lg',
        'icon-xl',
      ],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    variant: {
      control: 'select',
      description: 'Controls the semantic visual emphasis of the action.',
      options: [
        'default',
        'secondary',
        'outline',
        'destructive',
        'destructive-outline',
        'ghost',
        'link',
      ],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'COSS Button, unmodified. Triggers an action.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const Loading: Story = {
  args: {
    children: 'Saving',
    loading: true,
  },
}
