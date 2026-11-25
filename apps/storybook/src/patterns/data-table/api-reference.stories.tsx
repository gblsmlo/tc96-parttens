import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataGridPagination,
  DataTable,
  type DataTableColumnDef,
  useDataTable,
} from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { DataTableCanvas } from './data-table-canvas.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/DataTable/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface AnatomyRecord {
  id: string
  value: number
}

const anatomyRecords: AnatomyRecord[] = [
  { id: 'a', value: 1 },
  { id: 'b', value: 2 },
  { id: 'c', value: 3 },
]

const anatomyColumns: DataTableColumnDef<AnatomyRecord>[] = [
  {
    accessorKey: 'id',
    cell: () => <Slot name="cell" />,
    header: () => <Slot name="header" />,
  },
  {
    accessorKey: 'value',
    cell: () => <Slot name="cell" />,
    header: () => <Slot name="header" />,
    meta: { aggregations: ['count', 'sum'], label: 'Value' },
  },
]

function AnatomyTable() {
  const { table } = useDataTable<AnatomyRecord>({
    columns: anatomyColumns,
    data: anatomyRecords,
    enablePagination: true,
    getRowId: (record) => record.id,
    pageSize: 2,
  })

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        aria-label="Anatomy"
        defaultAggregations={{ value: 'sum' }}
        table={table}
      />
      <DataGridPagination table={table} />
    </div>
  )
}

export const Anatomy: Story = {
  render: () => <AnatomyTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(2)
    for (const slot of [
      'data-table',
      'data-table-viewport',
      'table-header',
      'table-body',
      'table-footer',
      'data-table-aggregation',
      'data-grid-pagination',
    ]) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
  },
}
