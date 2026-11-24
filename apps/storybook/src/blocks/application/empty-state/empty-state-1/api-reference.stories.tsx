import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState1 } from '@tc96/ui/blocks/application/empty-state/empty-state-1'
import { fn } from 'storybook/test'
import { guides } from '../fixtures/empty-state-1.ts'

const meta = {
  args: { guides, onCreate: fn(), onImport: fn() },
  component: EmptyState1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Empty State/EmptyState1/API Reference',
} satisfies Meta<typeof EmptyState1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
