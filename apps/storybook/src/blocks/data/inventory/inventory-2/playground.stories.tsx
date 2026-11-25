import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Inventory2Controls,
  inventory2ControlArgs,
  inventory2ControlArgTypes,
} from './inventory-2-controls.ts'
import { ComposedInventory2 } from './inventory-2-layouts.tsx'

const meta = {
  args: inventory2ControlArgs,
  argTypes: inventory2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedInventory2 {...args} onAdd={fn()} onRowAction={fn()} />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Data/Inventory/Inventory2/Playground',
} satisfies Meta<Inventory2Controls>

export default meta

type Story = StoryObj<Inventory2Controls>

export const Playground: Story = {}
