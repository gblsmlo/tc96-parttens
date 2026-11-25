import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue2 } from '@tc96/ui/blocks/data/revenue/revenue-2'
import { fn } from 'storybook/test'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
} from '../fixtures/revenue-2.ts'

const meta = {
  args: {
    conditions: initialConditions,
    onAssignOwner: fn(),
    onConditionsChange: fn(),
    onCreate: fn(),
    onRowAction: fn(),
    onStageUpdate: fn(),
    owners,
    pageSize: 8,
    renewals,
    rowActions,
    selectedIds: ['atlas', 'base-nuvem'],
    sort: initialSort,
  },
  component: Revenue2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Revenue/Revenue2/API Reference',
} satisfies Meta<typeof Revenue2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
