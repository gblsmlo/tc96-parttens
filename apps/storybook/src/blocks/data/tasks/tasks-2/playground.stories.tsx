import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Tasks2Controls,
  tasks2ControlArgs,
  tasks2ControlArgTypes,
} from './tasks-2-controls.ts'
import { ComposedTasks2 } from './tasks-2-layouts.tsx'

const meta = {
  args: tasks2ControlArgs,
  argTypes: tasks2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks2/Playground',
} satisfies Meta<Tasks2Controls>

export default meta

type Story = StoryObj<Tasks2Controls>

export const Playground: Story = {}
