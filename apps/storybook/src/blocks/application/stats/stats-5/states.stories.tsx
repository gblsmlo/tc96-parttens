import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats5 } from '@tc96/ui/blocks/application/stats/stats-5'
import { expect, fn, within } from 'storybook/test'
import { salesAndChurn } from '../fixtures/stats-5.ts'

const meta = {
  args: { items: salesAndChurn, onRetry: fn() },
  component: Stats5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats5/States',
} satisfies Meta<typeof Stats5>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', {
        name: 'Vendas e cancelamentos',
      }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando vendas'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as vendas'),
    ).toBeVisible()
  },
}
