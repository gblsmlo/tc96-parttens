import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTableCanvas } from './data-table-canvas.tsx'
import {
  type DataTableControls,
  dataTableControlArgs,
  dataTableControlArgTypes,
} from './data-table-controls.ts'
import { ComposedDataTable } from './data-table-layouts.tsx'

const meta = {
  args: dataTableControlArgs,
  argTypes: dataTableControlArgTypes,
  decorators: [DataTableCanvas],
  parameters: {
    controls: {
      exclude: ['bordered', 'empty', 'isLoading', 'resizable', 'selectedRow'],
    },
  },
  render: (args) => <ComposedDataTable {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Data Table/Stories',
} satisfies Meta<DataTableControls>

export default meta

type Story = StoryObj<DataTableControls>

export const Default: Story = {}

export const Borderless: Story = {
  args: { bordered: false },
  name: 'bordered false',
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const Empty: Story = {
  args: { empty: true },
}

export const ColumnResizing: Story = {
  args: { resizable: true },
  name: 'enableColumnResizing',
}

export const SelectedRow: Story = {
  args: { selectedRow: true },
}
