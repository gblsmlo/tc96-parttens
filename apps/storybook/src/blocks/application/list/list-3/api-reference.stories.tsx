import type { Meta, StoryObj } from '@storybook/react-vite'
import { List3 } from '@tc96/blocks/application/list/list-3'
import { fn } from 'storybook/test'
import { transactions } from '../fixtures/list-3.ts'

const meta = {
  args: { onPeriodChange: fn(), period: 'month', transactions },
  component: List3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/List/List3/API Reference',
} satisfies Meta<typeof List3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
