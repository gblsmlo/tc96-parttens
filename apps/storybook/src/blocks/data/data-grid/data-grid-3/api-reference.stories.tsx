import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid3 } from '@tc96/ui/blocks/data/data-grid/data-grid-3'
import { fn } from 'storybook/test'
import {
  initialConditions,
  initialSort,
  owners,
  renewals,
  rowActions,
} from '../fixtures/data-grid-3.ts'

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
  component: DataGrid3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Data/DataGrid/DataGrid3/API Reference',
} satisfies Meta<typeof DataGrid3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
