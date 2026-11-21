import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type TableControls,
  tableControlArgs,
  tableControlArgTypes,
} from './table-controls.ts'
import { TableCanvas } from './table-frame.tsx'
import { ComposedTable } from './table-layouts.tsx'

const meta = {
  args: tableControlArgs,
  argTypes: tableControlArgTypes,
  decorators: [TableCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedTable {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Table/Playground',
} satisfies Meta<TableControls>

export default meta

type Story = StoryObj<TableControls>

export const Playground: Story = {}
