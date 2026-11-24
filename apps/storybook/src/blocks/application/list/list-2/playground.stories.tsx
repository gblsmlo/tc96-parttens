import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type List2Controls,
  list2ControlArgs,
  list2ControlArgTypes,
} from './list-2-controls.ts'
import { ComposedList2 } from './list-2-layouts.tsx'

const meta = {
  args: list2ControlArgs,
  argTypes: list2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List2/Playground',
} satisfies Meta<List2Controls>

export default meta

type Story = StoryObj<List2Controls>

export const Playground: Story = {}
