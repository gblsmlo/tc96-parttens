import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Dashboard7Controls,
  dashboard7ControlArgs,
  dashboard7ControlArgTypes,
} from './dashboard-7-controls.ts'
import { ComposedDashboard7 } from './dashboard-7-layouts.tsx'

const meta = {
  args: dashboard7ControlArgs,
  argTypes: dashboard7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDashboard7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard7/Playground',
} satisfies Meta<Dashboard7Controls>

export default meta

type Story = StoryObj<Dashboard7Controls>

export const Playground: Story = {}
