import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Tasks4Controls,
  tasks4ControlArgs,
  tasks4ControlArgTypes,
} from './tasks-4-controls.ts'
import { ComposedTasks4 } from './tasks-4-layouts.tsx'

const meta = {
  args: tasks4ControlArgs,
  argTypes: tasks4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks4/Playground',
} satisfies Meta<Tasks4Controls>

export default meta

type Story = StoryObj<Tasks4Controls>

export const Playground: Story = {}
