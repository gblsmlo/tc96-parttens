import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Table7Controls,
  table7ControlArgs,
  table7ControlArgTypes,
} from './table-7-controls.ts'
import { ComposedTable7 } from './table-7-layouts.tsx'

const meta = {
  args: table7ControlArgs,
  argTypes: table7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable7 {...args} onRowAction={fn()} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table7/Playground',
} satisfies Meta<Table7Controls>

export default meta

type Story = StoryObj<Table7Controls>

export const Playground: Story = {}
