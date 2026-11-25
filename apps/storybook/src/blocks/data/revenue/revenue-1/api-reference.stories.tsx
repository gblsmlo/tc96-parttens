import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue1 } from '@tc96/ui/blocks/data/revenue/revenue-1'
import { fn } from 'storybook/test'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
} from '../fixtures/revenue-1.ts'

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
  component: Revenue1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/Revenue/Revenue1/API Reference',
} satisfies Meta<typeof Revenue1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
