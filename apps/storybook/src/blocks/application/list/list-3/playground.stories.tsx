import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type List3Controls,
  list3ControlArgs,
  list3ControlArgTypes,
} from './list-3-controls.ts'
import { ComposedList3 } from './list-3-layouts.tsx'

const meta = {
  args: list3ControlArgs,
  argTypes: list3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List3/Playground',
} satisfies Meta<List3Controls>

export default meta

type Story = StoryObj<List3Controls>

export const Playground: Story = {}
