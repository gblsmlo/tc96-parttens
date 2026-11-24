import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid2Controls,
  dataGrid2ControlArgs,
  dataGrid2ControlArgTypes,
} from './data-grid-2-controls.ts'
import { ComposedDataGrid2 } from './data-grid-2-layouts.tsx'

const meta = {
  args: dataGrid2ControlArgs,
  argTypes: dataGrid2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid2/Playground',
} satisfies Meta<DataGrid2Controls>

export default meta

type Story = StoryObj<DataGrid2Controls>

export const Playground: Story = {}
