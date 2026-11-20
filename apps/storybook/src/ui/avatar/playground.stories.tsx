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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedAvatar {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Avatar/Playground',
} satisfies Meta<AvatarControls>

export default meta

type Story = StoryObj<AvatarControls>

export const Playground: Story = {}
