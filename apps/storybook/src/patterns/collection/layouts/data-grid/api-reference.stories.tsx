import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataGrid,
  type DataGridColumnDef,
  useDataGrid,
} from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { Slot } from '../../../../test-utils/anatomy-slot'
import { DataGridCanvas } from './data-grid-canvas.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Collection/Layouts/Data Grid/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

interface AnatomyRecord {
  group: string
  id: string
}

const anatomyRecords: AnatomyRecord[] = [
  { group: 'Group', id: 'a' },
  { group: 'Group', id: 'b' },
  { group: 'Another group', id: 'c' },
]

const anatomyColumns: DataGridColumnDef<AnatomyRecord>[] = [
  {
    accessorKey: 'id',
    cell: () => <Slot name="cell" />,
    header: () => <Slot name="header" />,
  },
  {
    accessorKey: 'group',
    cell: () => <Slot name="cell" />,
    header: () => <Slot name="header" />,
  },
]

function AnatomyGrid() {
  const { table } = useDataGrid<AnatomyRecord>({
    columns: anatomyColumns,
    data: anatomyRecords,
    enablePagination: true,
    getRowId: (record) => record.id,
    pageSize: 3,
  })

  return (
    <DataGrid
      aria-label="Anatomy"
      getRowGroup={(record) => record.group}
      table={table}
    />
  )
}

export const Anatomy: Story = {
  render: () => <AnatomyGrid />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByRole('columnheader'),
    ).toHaveLength(2)
    for (const slot of [
      'data-grid',
      'data-grid-header',
      'data-grid-header-row',
      'data-grid-header-cell',
      'data-grid-body',
      'data-grid-group-row',
      'data-grid-row',
      'data-grid-cell',
      'data-grid-footer',
      'data-grid-pagination',
    ]) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
  },
}
