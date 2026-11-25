import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue3 } from '@tc96/ui/blocks/data/revenue/revenue-3'
import { fn } from 'storybook/test'
import {
  accounts,
  regions,
  rowActions,
  summary,
} from '../fixtures/revenue-3.ts'

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
  component: Revenue3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Revenue/Revenue3/API Reference',
} satisfies Meta<typeof Revenue3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
