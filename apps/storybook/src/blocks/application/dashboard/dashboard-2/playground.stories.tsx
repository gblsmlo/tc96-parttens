import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard2Controls,
  dashboard2ControlArgs,
  dashboard2ControlArgTypes,
} from './dashboard-2-controls.ts'
import { ComposedDashboard2 } from './dashboard-2-layouts.tsx'

const meta = {
  args: dashboard2ControlArgs,
  argTypes: dashboard2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard2/Playground',
} satisfies Meta<Dashboard2Controls>

export default meta

type Story = StoryObj<Dashboard2Controls>

export const Playground: Story = {}
