import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marketing2 } from '@tc96/ui/blocks/data/marketing/marketing-2'
import { fn } from 'storybook/test'
import {
  campaigns,
  initialSort,
  pageSizeOptions,
  period,
  rowActions,
  summary,
} from '../fixtures/marketing-2.ts'

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
  component: Marketing2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Marketing/Marketing2/API Reference',
} satisfies Meta<typeof Marketing2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
