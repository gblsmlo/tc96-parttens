import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard6Controls,
  dashboard6ControlArgs,
  dashboard6ControlArgTypes,
} from './dashboard-6-controls.ts'
import { ComposedDashboard6 } from './dashboard-6-layouts.tsx'

const meta = {
  args: dashboard6ControlArgs,
  argTypes: dashboard6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard6/Playground',
} satisfies Meta<Dashboard6Controls>

export default meta

type Story = StoryObj<Dashboard6Controls>

export const Playground: Story = {}
