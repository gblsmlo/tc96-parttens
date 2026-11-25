import type { Meta, StoryObj } from '@storybook/react-vite'
import { Projects2 } from '@tc96/ui/blocks/data/projects/projects-2'
import { fn } from 'storybook/test'
import { initialExpanded, tasks } from '../fixtures/projects-2.ts'

const meta = {
  args: { expanded: initialExpanded, onRetry: fn(), tasks },
  component: Projects2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Projects/Projects2/States',
} satisfies Meta<typeof Projects2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: { tasks: [] },
}
