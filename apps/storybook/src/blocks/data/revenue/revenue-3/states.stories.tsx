import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue3 } from '@tc96/ui/blocks/data/revenue/revenue-3'
import { expect, fn, within } from 'storybook/test'
import { accounts, regions, summary } from '../fixtures/revenue-3.ts'

const meta = {
  args: { accounts, onRetry: fn(), regions, summary },
  component: Revenue3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue3/States',
} satisfies Meta<typeof Revenue3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid')).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as contas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { accounts: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma conta para exibir.'),
    ).toBeVisible()
  },
}
