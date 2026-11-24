import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type List1Controls,
  list1ControlArgs,
  list1ControlArgTypes,
} from './list-1-controls.ts'
import { ComposedList1 } from './list-1-layouts.tsx'

const meta = {
  args: list1ControlArgs,
  argTypes: list1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List1/Playground',
} satisfies Meta<List1Controls>

export default meta

type Story = StoryObj<List1Controls>

export const Playground: Story = {}
