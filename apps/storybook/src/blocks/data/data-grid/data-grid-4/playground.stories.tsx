import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type DataGrid4Controls,
  dataGrid4ControlArgs,
  dataGrid4ControlArgTypes,
} from './data-grid-4-controls.ts'
import { ComposedDataGrid4 } from './data-grid-4-layouts.tsx'

const meta = {
  args: dataGrid4ControlArgs,
  argTypes: dataGrid4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedDataGrid4 {...args} onAdd={fn()} onRowAction={fn()} />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid4/Playground',
} satisfies Meta<DataGrid4Controls>

export default meta

type Story = StoryObj<DataGrid4Controls>

export const Playground: Story = {}
