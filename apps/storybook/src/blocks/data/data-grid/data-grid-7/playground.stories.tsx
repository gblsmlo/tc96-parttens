import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type DataGrid7Controls,
  dataGrid7ControlArgs,
  dataGrid7ControlArgTypes,
} from './data-grid-7-controls.ts'
import { ComposedDataGrid7 } from './data-grid-7-layouts.tsx'

const meta = {
  args: dataGrid7ControlArgs,
  argTypes: dataGrid7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid7 {...args} onRowAction={fn()} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid7/Playground',
} satisfies Meta<DataGrid7Controls>

export default meta

type Story = StoryObj<DataGrid7Controls>

export const Playground: Story = {}
