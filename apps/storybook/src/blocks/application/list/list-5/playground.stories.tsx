import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type List5Controls,
  list5ControlArgs,
  list5ControlArgTypes,
} from './list-5-controls.ts'
import { ComposedList5 } from './list-5-layouts.tsx'

const meta = {
  args: list5ControlArgs,
  argTypes: list5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedList5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List5/Playground',
} satisfies Meta<List5Controls>

export default meta

type Story = StoryObj<List5Controls>

export const Playground: Story = {}
