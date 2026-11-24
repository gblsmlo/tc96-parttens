import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Table4Controls,
  table4ControlArgs,
  table4ControlArgTypes,
} from './table-4-controls.ts'
import { ComposedTable4 } from './table-4-layouts.tsx'

const meta = {
  args: table4ControlArgs,
  argTypes: table4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedTable4 {...args} onAdd={fn()} onRowAction={fn()} />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table4/Playground',
} satisfies Meta<Table4Controls>

export default meta

type Story = StoryObj<Table4Controls>

export const Playground: Story = {}
