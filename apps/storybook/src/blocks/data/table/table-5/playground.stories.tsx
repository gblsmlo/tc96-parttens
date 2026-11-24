import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table5Controls,
  table5ControlArgs,
  table5ControlArgTypes,
} from './table-5-controls.ts'
import { ComposedTable5 } from './table-5-layouts.tsx'

const meta = {
  args: table5ControlArgs,
  argTypes: table5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table5/Playground',
} satisfies Meta<Table5Controls>

export default meta

type Story = StoryObj<Table5Controls>

export const Playground: Story = {}
