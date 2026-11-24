import type { Meta, StoryObj } from '@storybook/react-vite'
import { List4 } from '@tc96/ui/blocks/application/list/list-4'
import { integrations } from '../fixtures/list-4.ts'

const meta = {
  args: { integrations, onConnect: () => {} },
  component: List4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/List/List4/API Reference',
} satisfies Meta<typeof List4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
