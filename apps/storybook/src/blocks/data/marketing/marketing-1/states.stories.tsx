import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marketing1 } from '@tc96/ui/blocks/data/marketing/marketing-1'
import { fn } from 'storybook/test'
import {
  campaigns,
  pageSizeOptions,
  period,
  summary,
} from '../fixtures/marketing-1.ts'

const meta = {
  args: {
    campaigns,
    onRetry: fn(),
    pageSize: 8,
    pageSizeOptions,
    period,
    summary,
  },
  component: Marketing1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Marketing/Marketing1/States',
} satisfies Meta<typeof Marketing1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { campaigns: [] },
}
