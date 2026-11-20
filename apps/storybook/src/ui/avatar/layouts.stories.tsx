import type { Meta, StoryObj } from '@storybook/react-vite'
import { avatarControlArgs } from './avatar-controls.ts'
import { ComposedAvatar } from './avatar-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Avatar/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutImage: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} image={false} />,
}

export const AsButton: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} element="button" />,
}

export const Group: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} group />,
}

export const GroupWithCount: Story = {
  render: () => <ComposedAvatar {...avatarControlArgs} count group />,
}
