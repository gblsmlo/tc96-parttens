import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type EmptyState2Controls,
  emptyState2ControlArgs,
  emptyState2ControlArgTypes,
} from './empty-state-2-controls.ts'
import { ComposedEmptyState2 } from './empty-state-2-layouts.tsx'

const meta = {
  args: { ...emptyState2ControlArgs, onClear: fn(), onSuggestion: fn() },
  argTypes: emptyState2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState2/Playground',
} satisfies Meta<
  EmptyState2Controls & {
    onClear: () => void
    onSuggestion: (suggestion: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
