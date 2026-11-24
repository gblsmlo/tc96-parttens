import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats6 } from '@tc96/ui/blocks/application/stats/stats-6'
import { expect, fn, within } from 'storybook/test'
import { sleeves } from '../fixtures/stats-6.ts'

const meta = {
  args: { onPeriodChange: fn(), period: 'month', sleeves, onRetry: fn() },
  component: Stats6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats6/States',
} satisfies Meta<typeof Stats6>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', {
        name: 'Alocação da carteira',
      }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando carteira'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar a carteira'),
    ).toBeVisible()
  },
}
