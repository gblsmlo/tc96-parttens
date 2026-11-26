import type { Meta, StoryObj } from '@storybook/react-vite'
import { crm3ControlArgs } from './crm-3-controls.ts'
import { ComposedCrm3 } from './crm-3-layouts.tsx'

const meta = {
  args: crm3ControlArgs,
  component: ComposedCrm3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/CRM/Crm3/Usages',
} satisfies Meta<typeof ComposedCrm3>

export default meta

type Story = StoryObj<typeof meta>

export const SalesBoard: Story = {}

export const LeadsTable: Story = {
  args: { mode: 'table' },
}

export const BoardWithMore: Story = {
  args: { boardHasMore: true },
}

export const Empty: Story = {
  args: { empty: true, mode: 'table' },
}

export const Pending: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
}
