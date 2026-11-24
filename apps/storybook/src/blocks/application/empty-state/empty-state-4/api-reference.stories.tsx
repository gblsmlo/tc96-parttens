import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState4 } from '@tc96/blocks/application/empty-state/empty-state-4'

const meta = {
  args: { onCopyLink: () => {}, onInvite: () => {} },
  component: EmptyState4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Empty State/EmptyState4/API Reference',
} satisfies Meta<typeof EmptyState4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
