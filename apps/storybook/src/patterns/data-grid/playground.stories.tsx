import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGridCanvas } from './data-grid-canvas.tsx'
import {
  type DataGridControls,
  dataGridControlArgs,
  dataGridControlArgTypes,
} from './data-grid-controls.ts'
import { ComposedDataGrid } from './data-grid-layouts.tsx'

const meta = {
  args: dataGridControlArgs,
  argTypes: dataGridControlArgTypes,
  decorators: [DataGridCanvas],
  render: (args) => <ComposedDataGrid {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Playground',
} satisfies Meta<DataGridControls>

export default meta

type Story = StoryObj<DataGridControls>

export const Playground: Story = {}
