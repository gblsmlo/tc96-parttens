import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { agenda1ControlArgs } from './agenda-1-controls.ts'
import { ComposedAgenda1 } from './agenda-1-layouts.tsx'

const meta = {
  args: {
    ...agenda1ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAgenda1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Agenda/Agenda1/States',
} satisfies Meta<typeof ComposedAgenda1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedAgenda1 {...args} open={false} />,
}
