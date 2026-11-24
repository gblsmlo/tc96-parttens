import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard2 } from '@tc96/blocks/application/dashboard/dashboard-2'
import { fn } from 'storybook/test'
import {
  channels,
  initialSort,
  kpis,
  orders,
  sales,
} from '../fixtures/dashboard-2.ts'

const meta = {
  args: {
    channels,
    kpis,
    onRetry: fn(),
    onSortChange: fn(),
    orders,
    sales,
    sort: initialSort,
  },
  component: Dashboard2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Dashboard/Dashboard2/API Reference',
} satisfies Meta<typeof Dashboard2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
