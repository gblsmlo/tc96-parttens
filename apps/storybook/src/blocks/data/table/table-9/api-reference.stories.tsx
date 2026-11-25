import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table9 } from '@tc96/ui/blocks/data/table/table-9'
import { fn } from 'storybook/test'
import {
  campaigns,
  initialSort,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/table-9.ts'

const meta = {
  args: {
    campaigns,
    onCreate: fn(),
    onExport: fn(),
    onRowAction: fn(),
    pageSize: 8,
    pageSizeOptions,
    period,
    rowActions,
    sort: initialSort,
    summary,
  },
  component: Table9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table9/API Reference',
} satisfies Meta<typeof Table9>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
