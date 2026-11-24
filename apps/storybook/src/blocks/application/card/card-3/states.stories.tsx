import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card3 } from '@tc96/blocks/application/card/card-3'
import { expect, fn, within } from 'storybook/test'
import { profile } from '../fixtures/card-3.ts'

const meta = {
  args: { onFollow: () => {}, onMessage: () => {}, profile, onRetry: fn() },
  component: Card3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card3/States',
} satisfies Meta<typeof Card3>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { name: 'Marina Costa' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando perfil'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar o perfil'),
    ).toBeVisible()
  },
}
