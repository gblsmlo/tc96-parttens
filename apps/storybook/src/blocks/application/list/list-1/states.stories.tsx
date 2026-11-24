import type { Meta, StoryObj } from '@storybook/react-vite'
import { List1 } from '@tc96/ui/blocks/application/list/list-1'
import { expect, fn, within } from 'storybook/test'
import { metrics } from '../fixtures/list-1.ts'

const meta = {
  args: { metrics, onRetry: fn() },
  component: List1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List1/States',
} satisfies Meta<typeof List1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Métricas' }),
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
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar as métricas'),
    ).toBeVisible()
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
