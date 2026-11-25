import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support2 } from '@tc96/ui/blocks/data/support/support-2'
import { expect, fn, within } from 'storybook/test'
import { tickets } from '../fixtures/support-2.ts'

const meta = {
  args: { onRetry: fn(), pageSize: 6, pageSizeOptions: [6, 12, 24], tickets },
  component: Support2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support2/States',
} satisfies Meta<typeof Support2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible()
  },
}

export const Selected: Story = {
  args: { selectedIds: ['sup-1831', 'sup-1793'] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('toolbar', {
        name: 'Ações dos chamados selecionados',
      }),
    ).toHaveTextContent('2 chamados selecionados')
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando chamados')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Fila de suporte' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os chamados'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Fila de suporte' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { tickets: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum chamado para exibir.'),
    ).toBeVisible()
  },
}
