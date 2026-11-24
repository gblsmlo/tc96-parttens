import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState3 } from '@tc96/blocks/application/empty-state/empty-state-3'
import { fn } from 'storybook/test'
import { templates } from '../fixtures/empty-state-3.ts'

const meta = {
  args: { onCreate: fn(), onImport: fn(), onTemplate: fn(), templates },
  component: EmptyState3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Empty State/EmptyState3/API Reference',
} satisfies Meta<typeof EmptyState3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
