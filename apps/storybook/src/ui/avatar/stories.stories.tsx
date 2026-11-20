import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AvatarControls,
  avatarControlArgs,
  avatarControlArgTypes,
} from './avatar-controls.ts'
import { ComposedAvatar } from './avatar-layouts.tsx'

const meta = {
  args: avatarControlArgs,
  argTypes: avatarControlArgTypes,
  parameters: {
    controls: { exclude: ['broken', 'element', 'size'] },
    layout: 'centered',
  },
  render: (args) => <ComposedAvatar {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Avatar/Stories',
} satisfies Meta<AvatarControls>

export default meta

type Story = StoryObj<AvatarControls>

export const Default: Story = {}

export const BrokenImage: Story = {
  args: { broken: true },
}

export const Size16: Story = {
  args: { size: '16px' },
  name: 'Size 16px',
}

export const Size24: Story = {
  args: { size: '24px' },
  name: 'Size 24px',
}

export const Size40: Story = {
  args: { size: '40px' },
  name: 'Size 40px',
}

export const Size48: Story = {
  args: { size: '48px' },
  name: 'Size 48px',
}
