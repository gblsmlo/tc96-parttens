import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard5Controls,
  dashboard5ControlArgs,
  dashboard5ControlArgTypes,
} from './dashboard-5-controls.ts'
import { ComposedDashboard5 } from './dashboard-5-layouts.tsx'

const meta = {
  args: dashboard5ControlArgs,
  argTypes: dashboard5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard5/Playground',
} satisfies Meta<Dashboard5Controls>

export default meta

type Story = StoryObj<Dashboard5Controls>

export const Playground: Story = {}
