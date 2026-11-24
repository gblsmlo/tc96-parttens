import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard1 } from '@tc96/blocks/application/dashboard/dashboard-1'
import { fn } from 'storybook/test'
import {
  capacity,
  exceptions,
  filterOptions,
  kpis,
} from '../fixtures/dashboard-1.ts'

const meta = {
  args: {
    capacity,
    exceptions,
    filter: 'all',
    filterOptions,
    kpis,
    onFilterChange: fn(),
    onRetry: fn(),
  },
  component: Dashboard1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Dashboard/Dashboard1/API Reference',
} satisfies Meta<typeof Dashboard1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
