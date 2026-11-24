import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Table8Controls,
  table8ControlArgs,
  table8ControlArgTypes,
} from './table-8-controls.ts'
import { ComposedTable8 } from './table-8-layouts.tsx'

const meta = {
  args: table8ControlArgs,
  argTypes: table8ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTable8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table8/Playground',
} satisfies Meta<Table8Controls>

export default meta

type Story = StoryObj<Table8Controls>

export const Playground: Story = {}
