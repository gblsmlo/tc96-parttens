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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedBadge {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Badge/Playground',
} satisfies Meta<BadgeControls>

export default meta

type Story = StoryObj<BadgeControls>

export const Playground: Story = {}
