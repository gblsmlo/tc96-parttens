import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type List4Controls,
  list4ControlArgs,
  list4ControlArgTypes,
} from './list-4-controls.ts'
import { ComposedList4 } from './list-4-layouts.tsx'

const meta = {
  args: list4ControlArgs,
  argTypes: list4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List4/Playground',
} satisfies Meta<List4Controls>

export default meta

type Story = StoryObj<List4Controls>

export const Playground: Story = {}
