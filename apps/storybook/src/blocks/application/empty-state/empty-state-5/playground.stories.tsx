import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type EmptyState5Controls,
  emptyState5ControlArgs,
  emptyState5ControlArgTypes,
} from './empty-state-5-controls.ts'
import { ComposedEmptyState5 } from './empty-state-5-layouts.tsx'

const meta = {
  args: emptyState5ControlArgs,
  argTypes: emptyState5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState5/Playground',
} satisfies Meta<EmptyState5Controls>

export default meta

type Story = StoryObj<EmptyState5Controls>

export const Playground: Story = {}
