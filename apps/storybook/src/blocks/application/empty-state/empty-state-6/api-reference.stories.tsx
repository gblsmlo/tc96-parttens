import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState6 } from '@tc96/blocks/application/empty-state/empty-state-6'
import { tabs } from '../fixtures/empty-state-6.ts'

const meta = {
  args: {
    onSetup: () => {},
    onTabChange: () => {},
    tab: 'notifications',
    tabs,
  },
  component: EmptyState6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Empty State/EmptyState6/API Reference',
} satisfies Meta<typeof EmptyState6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
