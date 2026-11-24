import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type EmptyState1Controls,
  emptyState1ControlArgs,
  emptyState1ControlArgTypes,
} from './empty-state-1-controls.ts'
import { ComposedEmptyState1 } from './empty-state-1-layouts.tsx'

const meta = {
  args: { ...emptyState1ControlArgs, onCreate: fn(), onImport: fn() },
  argTypes: emptyState1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedEmptyState1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Empty State/EmptyState1/Playground',
} satisfies Meta<
  EmptyState1Controls & { onCreate: () => void; onImport: () => void }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
