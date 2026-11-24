import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid1Controls,
  dataGrid1ControlArgs,
  dataGrid1ControlArgTypes,
} from './data-grid-1-controls.ts'
import { ComposedDataGrid1 } from './data-grid-1-layouts.tsx'

const meta = {
  args: dataGrid1ControlArgs,
  argTypes: dataGrid1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid1/Playground',
} satisfies Meta<DataGrid1Controls>

export default meta

type Story = StoryObj<DataGrid1Controls>

export const Playground: Story = {}
