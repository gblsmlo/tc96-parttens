import type { Meta, StoryObj } from '@storybook/react-vite'
import { List2 } from '@tc96/ui/blocks/application/list/list-2'
import { fn } from 'storybook/test'
import { entries } from '../fixtures/list-2.ts'

const meta = {
  args: { entries, onRangeChange: fn(), range: '30d' },
  component: List2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/List/List2/API Reference',
} satisfies Meta<typeof List2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
