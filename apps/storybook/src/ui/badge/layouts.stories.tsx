import type { Meta, StoryObj } from '@storybook/react-vite'
import { badgeControlArgs } from './badge-controls.ts'
import { ComposedBadge } from './badge-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Badge/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithIcon: Story = {
  render: () => <ComposedBadge {...badgeControlArgs} icon />,
}

export const AsLink: Story = {
  render: () => <ComposedBadge {...badgeControlArgs} element="link" />,
}

export const AsButton: Story = {
  render: () => <ComposedBadge {...badgeControlArgs} element="button" />,
}
