import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Inventory1Controls,
  inventory1ControlArgs,
  inventory1ControlArgTypes,
} from './inventory-1-controls.ts'
import { ComposedInventory1 } from './inventory-1-layouts.tsx'

const meta = {
  args: inventory1ControlArgs,
  argTypes: inventory1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => (
    <ComposedInventory1 {...args} onAdd={fn()} onRowAction={fn()} />
  ),
  tags: ['!autodocs'],
  title: 'Blocks/Data/Inventory/Inventory1/Playground',
} satisfies Meta<Inventory1Controls>

export default meta

type Story = StoryObj<Inventory1Controls>

export const Playground: Story = {}
