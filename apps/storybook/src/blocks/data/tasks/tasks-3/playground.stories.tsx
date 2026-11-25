import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Tasks3Controls,
  tasks3ControlArgs,
  tasks3ControlArgTypes,
} from './tasks-3-controls.ts'
import { ComposedTasks3 } from './tasks-3-layouts.tsx'

const meta = {
  args: tasks3ControlArgs,
  argTypes: tasks3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks3/Playground',
} satisfies Meta<Tasks3Controls>

export default meta

type Story = StoryObj<Tasks3Controls>

export const Playground: Story = {}
