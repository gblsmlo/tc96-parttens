import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid6 } from '@tc96/ui/blocks/data/data-grid/data-grid-6'
import { fn } from 'storybook/test'
import {
  accounts,
  regions,
  rowActions,
  summary,
} from '../fixtures/data-grid-6.ts'

const meta = {
  args: {
    accounts,
    collapsedRegionIds: ['emea', 'apac', 'latam'],
    onCollapsedRegionIdsChange: fn(),
    onExport: fn(),
    onRowAction: fn(),
    regions,
    rowActions,
    summary,
  },
  component: DataGrid6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid6/API Reference',
} satisfies Meta<typeof DataGrid6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
