import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type EmptyState4Controls,
  emptyState4ControlArgs,
  emptyState4ControlArgTypes,
} from './empty-state-4-controls.ts'
import { ComposedEmptyState4 } from './empty-state-4-layouts.tsx'

const meta = {
  args: emptyState4ControlArgs,
  argTypes: emptyState4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState4/Playground',
} satisfies Meta<EmptyState4Controls>

export default meta

type Story = StoryObj<EmptyState4Controls>

export const Playground: Story = {}
