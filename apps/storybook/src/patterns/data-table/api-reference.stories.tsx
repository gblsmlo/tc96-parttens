import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DataTable,
  type DataTableColumnDef,
  DataTableDescription,
  DataTableTitle,
  DataTableTitleCell,
  useDataTable,
} from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'
import { DataTableCanvas } from './data-table-canvas.tsx'

interface AnatomyRecord {
  first: string
  id: string
  second: string
  third: string
}

const records: AnatomyRecord[] = ['a', 'b', 'c'].map((id) => ({
  first: id,
  id,
  second: id,
  third: id,
}))

const valueColumns: DataTableColumnDef<AnatomyRecord>[] = (
  ['first', 'second', 'third'] as const
).map((accessorKey) => ({
  accessorKey,
  cell: () => <Slot name="cell" />,
  footer: () => <Slot name="footer" />,
  header: () => <Slot name="header" />,
}))

const columns: DataTableColumnDef<AnatomyRecord>[] = [
  {
    accessorKey: 'id',
    cell: () => (
      <div className="flex flex-col gap-1 rounded-sm border border-dashed p-1.5">
        <span className="text-muted-foreground text-xs">cell</span>
        <DataTableTitleCell>
          <DataTableTitle>
            <Slot name="title" />
          </DataTableTitle>
          <DataTableDescription>
            <Slot name="description" />
          </DataTableDescription>
        </DataTableTitleCell>
      </div>
    ),
    footer: () => <Slot name="footer" />,
    header: () => <Slot name="header" />,
  },
  ...valueColumns,
]

function AnatomyTable() {
  const { table } = useDataTable<AnatomyRecord>({
    columns,
    data: records,
    getRowId: (record) => record.id,
  })

  return <DataTable aria-label="Anatomy" table={table} />
}

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/DataTable/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => <AnatomyTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(4)
    for (const slot of [
      'data-table',
      'data-table-viewport',
      'table-header',
      'table-body',
      'data-table-title-cell',
      'data-table-title',
      'data-table-description',
      'table-footer',
    ]) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
  },
}
