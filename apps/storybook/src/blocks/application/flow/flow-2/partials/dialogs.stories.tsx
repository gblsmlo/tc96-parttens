import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2Dialogs } from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { expect, fn, userEvent, within } from 'storybook/test'
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

const screen = () => within(document.body)

export const ClearResults: Story = {
  args: { clearOpen: true },
  play: async ({ args }) => {
    const dialog = await screen().findByRole('alertdialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Limpar resultados' }),
    )
    await expect(args.onClearResults).toHaveBeenCalledOnce()
  },
}

export const DeleteStep: Story = {
  args: { pendingDelete: 'decide', pendingDeleteName: 'Decidir abordagem' },
  play: async ({ args }) => {
    const dialog = await screen().findByRole('alertdialog')
    await expect(dialog).toHaveTextContent('Decidir abordagem')
    await userEvent.click(
      within(dialog).getByRole('button', { name: /Excluir/ }),
    )
    await expect(args.onDelete).toHaveBeenCalledWith('decide')
  },
}
