import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table2 } from '@tc96/ui/blocks/data/table/table-2'
import { fn } from 'storybook/test'
import { initialSort, members, pageSizeOptions } from '../fixtures/table-2.ts'

const meta = {
  args: {
    members,
    onSave: fn(),
    onShowPausedChange: fn(),
    pageSize: 8,
    pageSizeOptions,
    sort: initialSort,
  },
  component: Table2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table2/API Reference',
} satisfies Meta<typeof Table2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
