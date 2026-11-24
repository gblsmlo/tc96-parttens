import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid5Controls,
  dataGrid5ControlArgs,
  dataGrid5ControlArgTypes,
} from './data-grid-5-controls.ts'
import { ComposedDataGrid5 } from './data-grid-5-layouts.tsx'

const meta = {
  args: dataGrid5ControlArgs,
  argTypes: dataGrid5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid5/Playground',
} satisfies Meta<DataGrid5Controls>

export default meta

type Story = StoryObj<DataGrid5Controls>

export const Playground: Story = {}
