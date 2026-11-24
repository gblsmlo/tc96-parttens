import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table9Controls,
  table9ControlArgs,
  table9ControlArgTypes,
} from './table-9-controls.ts'
import { ComposedTable9 } from './table-9-layouts.tsx'

const meta = {
  args: table9ControlArgs,
  argTypes: table9ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table9/Playground',
} satisfies Meta<Table9Controls>

export default meta

type Story = StoryObj<Table9Controls>

export const Playground: Story = {}
