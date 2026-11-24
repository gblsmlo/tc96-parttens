import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats1 } from '@tc96/blocks/application/stats/stats-1'
import { expect, fn, within } from 'storybook/test'
import { stats } from '../fixtures/stats-1.ts'

const meta = {
  args: { onStatAction: fn(), stats, onRetry: fn() },
  component: Stats1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats1/States',
} satisfies Meta<typeof Stats1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Indicadores' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando indicadores'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar os indicadores',
      ),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { stats: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum indicador ainda'),
    ).toBeVisible()
  },
}
