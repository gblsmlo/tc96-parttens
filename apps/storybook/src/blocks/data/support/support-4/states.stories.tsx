import type { Meta, StoryObj } from '@storybook/react-vite'
import { Support4 } from '@tc96/ui/blocks/data/support/support-4'
import { expect, fn, within } from 'storybook/test'
import { rules } from '../fixtures/support-4.ts'

const meta = {
  args: { onRetry: fn(), rules },
  component: Support4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support4/States',
} satisfies Meta<typeof Support4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible()
  },
}

export const Reordered: Story = {
  args: { onResetOrder: fn(), onRuleMove: fn(), orderChanged: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Restaurar ordem' }),
    ).toBeEnabled()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando regras')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Regras de roteamento' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as regras'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Regras de roteamento' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { rules: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma regra de roteamento.'),
    ).toBeVisible()
  },
}
