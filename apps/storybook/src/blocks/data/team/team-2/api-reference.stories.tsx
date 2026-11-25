import type { Meta, StoryObj } from '@storybook/react-vite'
import { Team2 } from '@tc96/ui/blocks/data/team/team-2'
import { fn } from 'storybook/test'
import { initialSort, members, pageSizeOptions } from '../fixtures/team-2.ts'

const meta = {
  args: {
    members,
    onSave: fn(),
    onShowPausedChange: fn(),
    pageSize: 8,
    pageSizeOptions,
    sort: initialSort,
  },
  component: Team2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Team/Team2/API Reference',
} satisfies Meta<typeof Team2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
