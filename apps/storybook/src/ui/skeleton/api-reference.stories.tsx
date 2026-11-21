import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from '@tc96/ui/skeleton'

const meta = {
  args: { className: 'h-4 w-48' },
  component: Skeleton,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Skeleton/API Reference',
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
