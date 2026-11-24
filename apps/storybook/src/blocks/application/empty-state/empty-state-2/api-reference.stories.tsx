import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState2 } from '@tc96/ui/blocks/application/empty-state/empty-state-2'
import { fn } from 'storybook/test'
import { suggestions } from '../fixtures/empty-state-2.ts'

const meta = {
  args: {
    onClear: fn(),
    onSuggestion: fn(),
    query: 'fatura atrasada',
    suggestions,
  },
  component: EmptyState2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Empty State/EmptyState2/API Reference',
} satisfies Meta<typeof EmptyState2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
