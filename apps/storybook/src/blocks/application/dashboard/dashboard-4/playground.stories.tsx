import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard4Controls,
  dashboard4ControlArgs,
  dashboard4ControlArgTypes,
} from './dashboard-4-controls.ts'
import { ComposedDashboard4 } from './dashboard-4-layouts.tsx'

const meta = {
  args: dashboard4ControlArgs,
  argTypes: dashboard4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard4/Playground',
} satisfies Meta<Dashboard4Controls>

export default meta

type Story = StoryObj<Dashboard4Controls>

export const Playground: Story = {}
