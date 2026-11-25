import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGridCanvas } from './data-grid-canvas.tsx'
import {
  InventoryGrid,
  PageSizeGrid,
  RenewalsGrid,
} from './data-grid-table-blocks.tsx'

const meta = {
  decorators: [DataGridCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithConditionFilters: Story = {
  render: () => (
    <RenewalsGrid
      initialConditions={[
        {
          columnId: 'segment',
          id: 'c1',
          operator: 'is',
          value: ['enterprise'],
        },
        {
          columnId: 'risk',
          id: 'c2',
          operator: 'is-any-of',
          value: ['high', 'medium'],
        },
      ]}
    />
  ),
}

export const WithPageSizeSelector: Story = {
  render: () => <PageSizeGrid />,
}

export const WithCellValidation: Story = {
  render: () => (
    <InventoryGrid serverErrors={{ 'INV-2:sku': 'O SKU já está em uso.' }} />
  ),
}
