import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid6Controls,
  dataGrid6ControlArgs,
  dataGrid6ControlArgTypes,
} from './data-grid-6-controls.ts'
import { ComposedDataGrid6 } from './data-grid-6-layouts.tsx'

const meta = {
  args: dataGrid6ControlArgs,
  argTypes: dataGrid6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid6/Playground',
} satisfies Meta<DataGrid6Controls>

export default meta

type Story = StoryObj<DataGrid6Controls>

export const Playground: Story = {}
