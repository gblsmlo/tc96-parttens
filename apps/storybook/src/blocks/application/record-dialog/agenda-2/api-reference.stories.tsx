import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { agenda2ControlArgs } from './agenda-2-controls.ts'
import { ComposedAgenda2 } from './agenda-2-layouts.tsx'

const meta = {
  args: {
    ...agenda2ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAgenda2 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Dialog/Agenda/Agenda2/API Reference',
} satisfies Meta<typeof ComposedAgenda2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
