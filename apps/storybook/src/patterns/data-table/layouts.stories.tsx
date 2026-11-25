import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTableCanvas } from './data-table-canvas.tsx'
import { dataTableControlArgs } from './data-table-controls.ts'
import { ComposedDataTable } from './data-table-layouts.tsx'

const meta = {
  decorators: [DataTableCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataTable/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithColumnsMenu: Story = {
  render: () => <ComposedDataTable {...dataTableControlArgs} columnsMenu />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedDataTable {...dataTableControlArgs} footer={false} />,
}

export const WithoutPagination: Story = {
  render: () => (
    <ComposedDataTable {...dataTableControlArgs} pagination={false} />
  ),
}

export const WithoutSelectionColumn: Story = {
  render: () => (
    <ComposedDataTable {...dataTableControlArgs} selection={false} />
  ),
}

export const WithoutRowClick: Story = {
  render: () => (
    <ComposedDataTable {...dataTableControlArgs} rowClick={false} />
  ),
}

export const ColumnResizing: Story = {
  render: () => <ComposedDataTable {...dataTableControlArgs} resizable />,
}
