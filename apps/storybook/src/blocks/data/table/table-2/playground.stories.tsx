import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table2Controls,
  table2ControlArgs,
  table2ControlArgTypes,
} from './table-2-controls.ts'
import { ComposedTable2 } from './table-2-layouts.tsx'

const meta = {
  args: table2ControlArgs,
  argTypes: table2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table2/Playground',
} satisfies Meta<Table2Controls>

export default meta

type Story = StoryObj<Table2Controls>

export const Playground: Story = {}
