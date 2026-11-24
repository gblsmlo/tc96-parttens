import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card1 } from '@tc96/ui/blocks/application/card/card-1'
import { expect, fn, within } from 'storybook/test'
import { facts } from '../fixtures/card-1.ts'

const meta = {
  args: { facts, onRetry: fn() },
  component: Card1,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card1/States',
} satisfies Meta<typeof Card1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Detalhes' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando detalhes'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar os detalhes'),
    ).toBeVisible()
  },
}
