import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from 'tc96/ui'

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
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      description: 'Controls the semantic visual emphasis of the action.',
      options: [
        'primary',
        'secondary',
        'outline',
        'destructive',
        'destructive-ghost',
        'destructive-outline',
        'ghost',
        'link',
      ],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Triggers an action. Primary is the default appearance and medium is the default size.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'primary',
  },
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
