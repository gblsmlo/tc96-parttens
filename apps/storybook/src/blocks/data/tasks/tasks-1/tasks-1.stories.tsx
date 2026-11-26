import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Tasks1Controls,
  tasks1ControlArgs,
  tasks1ControlArgTypes,
} from './tasks-1-controls.ts'
import { ComposedTasks1 } from './tasks-1-layouts.tsx'

const meta = {
  args: tasks1ControlArgs,
  argTypes: tasks1ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks1',
} satisfies Meta<Tasks1Controls>

export default meta

type Story = StoryObj<Tasks1Controls>

export const Tasks1: Story = {}
