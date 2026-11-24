import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type EmptyState3Controls,
  emptyState3ControlArgs,
  emptyState3ControlArgTypes,
} from './empty-state-3-controls.ts'
import { ComposedEmptyState3 } from './empty-state-3-layouts.tsx'

const meta = {
  args: {
    ...emptyState3ControlArgs,
    onCreate: fn(),
    onImport: fn(),
    onTemplate: fn(),
  },
  argTypes: emptyState3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState3/Playground',
} satisfies Meta<
  EmptyState3Controls & {
    onCreate: () => void
    onImport: () => void
    onTemplate: (id: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
