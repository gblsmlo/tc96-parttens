import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGridCanvas } from './data-grid-canvas.tsx'
import { dataGridControlArgs } from './data-grid-controls.ts'
import { ComposedDataGrid } from './data-grid-layouts.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithToolbar: Story = {
  render: () => <ComposedDataGrid {...dataGridControlArgs} toolbar />,
}

export const GroupedByOwner: Story = {
  render: () => <ComposedDataGrid {...dataGridControlArgs} grouped />,
}

export const WithAddRow: Story = {
  render: () => <ComposedDataGrid {...dataGridControlArgs} addRow />,
}

export const WithoutPagination: Story = {
  render: () => (
    <ComposedDataGrid {...dataGridControlArgs} pagination={false} />
  ),
}

export const WithoutSelectionColumn: Story = {
  render: () => <ComposedDataGrid {...dataGridControlArgs} selection={false} />,
}

export const WithoutFillColumn: Story = {
  render: () => (
    <ComposedDataGrid {...dataGridControlArgs} fillColumn={false} />
  ),
}
