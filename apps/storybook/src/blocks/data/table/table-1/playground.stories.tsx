import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table1Controls,
  table1ControlArgs,
  table1ControlArgTypes,
} from './table-1-controls.ts'
import { ComposedTable1 } from './table-1-layouts.tsx'

const meta = {
  args: table1ControlArgs,
  argTypes: table1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table1/Playground',
} satisfies Meta<Table1Controls>

export default meta

type Story = StoryObj<Table1Controls>

export const Playground: Story = {}
