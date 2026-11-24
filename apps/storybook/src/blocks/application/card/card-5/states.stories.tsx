import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card5 } from '@tc96/blocks/application/card/card-5'
import { expect, fn, within } from 'storybook/test'
import { shortcuts } from '../fixtures/card-5.ts'

const meta = {
  args: { onSelect: fn(), shortcuts, onRetry: fn() },
  component: Card5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card5/States',
} satisfies Meta<typeof Card5>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Atalhos rápidos' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando atalhos'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar os atalhos'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { shortcuts: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum atalho disponível'),
    ).toBeVisible()
  },
}
