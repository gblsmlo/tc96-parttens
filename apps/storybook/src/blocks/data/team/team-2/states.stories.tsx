import type { Meta, StoryObj } from '@storybook/react-vite'
import { Team2 } from '@tc96/ui/blocks/data/team/team-2'
import { fn } from 'storybook/test'
import { members, pageSizeOptions } from '../fixtures/team-2.ts'

const meta = {
  args: {
    members,
    onRetry: fn(),
    pageSize: 8,
    pageSizeOptions,
  },
  component: Team2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Team/Team2/States',
} satisfies Meta<typeof Team2>

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
