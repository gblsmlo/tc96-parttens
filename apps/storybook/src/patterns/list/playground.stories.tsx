import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListCanvas } from './list-canvas.tsx'
import {
  type ListControls,
  listControlArgs,
  listControlArgTypes,
} from './list-controls.ts'
import { ComposedList } from './list-layouts.tsx'

const meta = {
  args: listControlArgs,
  argTypes: listControlArgTypes,
  decorators: [ListCanvas],
  render: (args) => <ComposedList {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/List/Playground',
} satisfies Meta<ListControls>

export default meta

type Story = StoryObj<ListControls>

export const Playground: Story = {}
