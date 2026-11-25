import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marketing2 } from '@tc96/ui/blocks/data/marketing/marketing-2'
import { fn } from 'storybook/test'
import {
  campaigns,
  pageSizeOptions,
  period,
  summary,
} from '../fixtures/marketing-2.ts'

const meta = {
  args: {
    campaigns,
    onRetry: fn(),
    pageSize: 8,
    pageSizeOptions,
    period,
    summary,
  },
  component: Marketing2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Marketing/Marketing2/States',
} satisfies Meta<typeof Marketing2>

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
