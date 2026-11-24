import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table6 } from '@tc96/ui/blocks/data/table/table-6'
import { fn } from 'storybook/test'
import { accounts, regions, rowActions, summary } from '../fixtures/table-6.ts'

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
  component: Table6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Table/Table6/API Reference',
} satisfies Meta<typeof Table6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
