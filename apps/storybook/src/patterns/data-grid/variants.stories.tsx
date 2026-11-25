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
  parameters: {
    controls: {
      exclude: ['density', 'empty', 'fillColumn', 'loading', 'selectedRow'],
    },
  },
  render: (args) => <ComposedDataGrid {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/DataGrid/Variants',
} satisfies Meta<DataGridControls>

export default meta

type Story = StoryObj<DataGridControls>

export const Default: Story = {}

export const DensityMedium: Story = {
  args: { density: 'medium' },
  name: 'Density medium',
}

export const DensityTall: Story = {
  args: { density: 'tall' },
  name: 'Density tall',
}

export const DensityExtraTall: Story = {
  args: { density: 'extra-tall' },
  name: 'Density extra-tall',
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}

export const SelectedRow: Story = {
  args: { selectedRow: true },
}
