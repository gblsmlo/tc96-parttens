import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table6Controls,
  table6ControlArgs,
  table6ControlArgTypes,
} from './table-6-controls.ts'
import { ComposedTable6 } from './table-6-layouts.tsx'

const meta = {
  args: table6ControlArgs,
  argTypes: table6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table6/Playground',
} satisfies Meta<Table6Controls>

export default meta

type Story = StoryObj<Table6Controls>

export const Playground: Story = {}
