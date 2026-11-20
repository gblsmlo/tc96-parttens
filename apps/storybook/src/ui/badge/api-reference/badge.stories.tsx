import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { badgeSizeNames, badgeVariantNames } from '../badge-api.ts'

const meta = {
  args: {
    children: 'Badge',
    size: 'default',
    variant: 'primary',
  },
  argTypes: {
    size: { control: 'inline-radio', options: badgeSizeNames },
    variant: { control: 'select', options: badgeVariantNames },
  },
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Badge/API Reference/Badge',
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Reference: Story = { name: 'Badge' }
