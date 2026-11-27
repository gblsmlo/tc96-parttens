import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordProperties1Controls,
  recordProperties1ControlArgs,
  recordProperties1ControlArgTypes,
} from './record-properties-1-controls.ts'
import { TaskProperties } from './record-properties-1-layouts.tsx'

const meta = {
  args: recordProperties1ControlArgs,
  argTypes: recordProperties1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <TaskProperties {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Properties/RecordProperties1/Playground',
} satisfies Meta<RecordProperties1Controls>

export default meta

type Story = StoryObj<RecordProperties1Controls>

export const Playground: Story = {}
