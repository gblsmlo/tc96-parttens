import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2Dialogs } from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { fn } from 'storybook/test'
import { collectionsConnections } from '../../fixtures/collections-agent'

const meta = {
  args: {
    connections: collectionsConnections,
    onClearOpenChange: fn(),
    onClearResults: fn(),
    onDelete: fn(),
    onPendingDeleteChange: fn(),
  },
  component: Flow2Dialogs,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow2/Partials/Dialogs',
} satisfies Meta<typeof Flow2Dialogs>

export default meta

type Story = StoryObj<typeof meta>

export const ClearResults: Story = {
  args: { clearOpen: true },
}

export const DeleteStep: Story = {
  args: { pendingDelete: 'decide', pendingDeleteName: 'Decidir abordagem' },
}
