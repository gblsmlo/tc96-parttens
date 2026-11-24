import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table3Controls,
  table3ControlArgs,
  table3ControlArgTypes,
} from './table-3-controls.ts'
import { ComposedTable3 } from './table-3-layouts.tsx'

const meta = {
  args: table3ControlArgs,
  argTypes: table3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table3/Playground',
} satisfies Meta<Table3Controls>

export default meta

type Story = StoryObj<Table3Controls>

export const Playground: Story = {}
