import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats7 } from '@tc96/ui/blocks/application/stats/stats-7'
import { expect, fn, within } from 'storybook/test'
import { stats7Metrics } from '../fixtures/stats-7.ts'

const meta = {
  args: { metrics: stats7Metrics, onRetry: fn() },
  component: Stats7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats7/States',
} satisfies Meta<typeof Stats7>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Métricas' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando métricas'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as métricas'),
    ).toBeVisible()
    canvas.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const Empty: Story = {
  args: { metrics: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma métrica ainda'),
    ).toBeVisible()
  },
}
