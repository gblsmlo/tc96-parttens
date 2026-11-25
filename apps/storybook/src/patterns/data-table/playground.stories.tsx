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
  render: (args) => <ComposedDataTable {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/DataTable/Playground',
} satisfies Meta<DataTableControls>

export default meta

type Story = StoryObj<DataTableControls>

export const Playground: Story = {}
