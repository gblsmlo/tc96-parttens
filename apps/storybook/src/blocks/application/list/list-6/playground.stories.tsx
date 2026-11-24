import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type List6Controls,
  list6ControlArgs,
  list6ControlArgTypes,
} from './list-6-controls.ts'
import { ComposedList6 } from './list-6-layouts.tsx'

const meta = {
  args: list6ControlArgs,
  argTypes: list6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List6/Playground',
} satisfies Meta<List6Controls>

export default meta

type Story = StoryObj<List6Controls>

export const Playground: Story = {}
