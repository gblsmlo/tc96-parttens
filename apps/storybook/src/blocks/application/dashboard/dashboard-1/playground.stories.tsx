import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard1Controls,
  dashboard1ControlArgs,
  dashboard1ControlArgTypes,
} from './dashboard-1-controls.ts'
import { ComposedDashboard1 } from './dashboard-1-layouts.tsx'

const meta = {
  args: dashboard1ControlArgs,
  argTypes: dashboard1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard1/Playground',
} satisfies Meta<Dashboard1Controls>

export default meta

type Story = StoryObj<Dashboard1Controls>

export const Playground: Story = {}
