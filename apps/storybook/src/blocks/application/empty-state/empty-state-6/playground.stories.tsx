import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type EmptyState6Controls,
  emptyState6ControlArgs,
  emptyState6ControlArgTypes,
} from './empty-state-6-controls.ts'
import { ComposedEmptyState6 } from './empty-state-6-layouts.tsx'

const meta = {
  args: emptyState6ControlArgs,
  argTypes: emptyState6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState6/Playground',
} satisfies Meta<EmptyState6Controls>

export default meta

type Story = StoryObj<EmptyState6Controls>

export const Playground: Story = {}
