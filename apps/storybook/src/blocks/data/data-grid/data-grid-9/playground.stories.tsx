import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type DataGrid9Controls,
  dataGrid9ControlArgs,
  dataGrid9ControlArgTypes,
} from './data-grid-9-controls.ts'
import { ComposedDataGrid9 } from './data-grid-9-layouts.tsx'

const meta = {
  args: dataGrid9ControlArgs,
  argTypes: dataGrid9ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDataGrid9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid9/Playground',
} satisfies Meta<DataGrid9Controls>

export default meta

type Story = StoryObj<DataGrid9Controls>

export const Playground: Story = {}
