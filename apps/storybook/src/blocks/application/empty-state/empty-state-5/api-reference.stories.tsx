import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState5 } from '@tc96/blocks/application/empty-state/empty-state-5'
import { connectors } from '../fixtures/empty-state-5.ts'

const meta = {
  args: { connectors, onConnect: () => {} },
  component: EmptyState5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Empty State/EmptyState5/API Reference',
} satisfies Meta<typeof EmptyState5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
