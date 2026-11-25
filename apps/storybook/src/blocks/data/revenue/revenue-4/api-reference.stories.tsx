import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue4 } from '@tc96/ui/blocks/data/revenue/revenue-4'
import { fn } from 'storybook/test'
import {
  accounts,
  regions,
  rowActions,
  summary,
} from '../fixtures/revenue-4.ts'

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
  component: Revenue4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Revenue/Revenue4/API Reference',
} satisfies Meta<typeof Revenue4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
