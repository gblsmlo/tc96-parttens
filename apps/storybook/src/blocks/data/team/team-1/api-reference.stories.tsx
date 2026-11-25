import type { Meta, StoryObj } from '@storybook/react-vite'
import { Team1 } from '@tc96/ui/blocks/data/team/team-1'
import { fn } from 'storybook/test'
import { initialSort, members, pageSizeOptions } from '../fixtures/team-1.ts'

const meta = {
  args: {
    members,
    onSave: fn(),
    onShowPausedChange: fn(),
    pageSize: 8,
    pageSizeOptions,
    sort: initialSort,
  },
  component: Team1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Team/Team1/API Reference',
} satisfies Meta<typeof Team1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
