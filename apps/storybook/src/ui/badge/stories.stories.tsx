import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type BadgeControls,
  badgeControlArgs,
  badgeControlArgTypes,
} from './badge-controls.ts'
import { ComposedBadge } from './badge-layouts.tsx'

const meta = {
  args: badgeControlArgs,
  argTypes: badgeControlArgTypes,
  parameters: {
    controls: { exclude: ['variant', 'size', 'element'] },
    layout: 'centered',
  },
  render: (args) => <ComposedBadge {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Badge/Stories',
} satisfies Meta<BadgeControls>

export default meta

type Story = StoryObj<BadgeControls>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const ErrorVariant: Story = {
  args: { variant: 'error' },
  name: 'Error',
}

export const Info: Story = {
  args: { variant: 'info' },
}

export const Success: Story = {
  args: { variant: 'success' },
}

export const Warning: Story = {
  args: { variant: 'warning' },
}

export const Large: Story = {
  args: { size: 'large' },
}
