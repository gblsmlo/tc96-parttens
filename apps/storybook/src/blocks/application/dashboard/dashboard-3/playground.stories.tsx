import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard3Controls,
  dashboard3ControlArgs,
  dashboard3ControlArgTypes,
} from './dashboard-3-controls.ts'
import { ComposedDashboard3 } from './dashboard-3-layouts.tsx'

const meta = {
  args: dashboard3ControlArgs,
  argTypes: dashboard3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard3/Playground',
} satisfies Meta<Dashboard3Controls>

export default meta

type Story = StoryObj<Dashboard3Controls>

export const Playground: Story = {}
