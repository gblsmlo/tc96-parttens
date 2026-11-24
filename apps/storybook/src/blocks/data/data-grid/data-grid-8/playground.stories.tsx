import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid8Controls,
  dataGrid8ControlArgs,
  dataGrid8ControlArgTypes,
} from './data-grid-8-controls.ts'
import { ComposedDataGrid8 } from './data-grid-8-layouts.tsx'

const meta = {
  args: dataGrid8ControlArgs,
  argTypes: dataGrid8ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid8/Playground',
} satisfies Meta<DataGrid8Controls>

export default meta

type Story = StoryObj<DataGrid8Controls>

export const Playground: Story = {}
