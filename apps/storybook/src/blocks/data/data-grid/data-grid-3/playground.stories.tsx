import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid3Controls,
  dataGrid3ControlArgs,
  dataGrid3ControlArgTypes,
} from './data-grid-3-controls.ts'
import { ComposedDataGrid3 } from './data-grid-3-layouts.tsx'

const meta = {
  args: dataGrid3ControlArgs,
  argTypes: dataGrid3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid3/Playground',
} satisfies Meta<DataGrid3Controls>

export default meta

type Story = StoryObj<DataGrid3Controls>

export const Playground: Story = {}
