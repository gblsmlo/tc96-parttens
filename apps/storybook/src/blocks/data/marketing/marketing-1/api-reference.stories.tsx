import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marketing1 } from '@tc96/ui/blocks/data/marketing/marketing-1'
import { fn } from 'storybook/test'
import {
  campaigns,
  initialSort,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/marketing-1.ts'

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
  component: Marketing1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Marketing/Marketing1/API Reference',
} satisfies Meta<typeof Marketing1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
