import type { Meta, StoryObj } from '@storybook/react-vite'
import { finance4ControlArgs } from './finance-4-controls.ts'
import { ComposedFinance4 } from './finance-4-layouts.tsx'

const meta = {
  args: finance4ControlArgs,
  component: ComposedFinance4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance4/Usages',
} satisfies Meta<typeof ComposedFinance4>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {}

export const Table: Story = {
  args: { groupBy: 'client', mode: 'table' },
}

export const Board: Story = {
  args: { mode: 'kanban' },
}

export const Empty: Story = {
  args: { empty: true },
}

export const Pending: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
}
