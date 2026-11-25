import type { Meta, StoryObj } from '@storybook/react-vite'
import { Team1 } from '@tc96/ui/blocks/data/team/team-1'
import { fn } from 'storybook/test'
import { members, pageSizeOptions } from '../fixtures/team-1.ts'

const meta = {
  args: {
    members,
    onRetry: fn(),
    pageSize: 8,
    pageSizeOptions,
  },
  component: Team1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Team/Team1/States',
} satisfies Meta<typeof Team1>

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
  args: { members: [] },
}
