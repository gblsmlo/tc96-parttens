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
  parameters: {
    controls: { exclude: ['container', 'selectedRow', 'variant'] },
    layout: 'centered',
  },
  render: (args) => <ComposedTable {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Table/Stories',
} satisfies Meta<TableControls>

export default meta

type Story = StoryObj<TableControls>

export const Default: Story = {}

export const Card: Story = {
  args: { variant: 'card' },
}

export const SelectedRow: Story = {
  args: { selectedRow: true },
}
