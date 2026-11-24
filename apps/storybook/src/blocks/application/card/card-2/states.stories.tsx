import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card2 } from '@tc96/ui/blocks/application/card/card-2'
import { expect, fn, within } from 'storybook/test'
import { integrations } from '../fixtures/card-2.ts'

const meta = {
  args: { integrations, onConnect: () => {}, onRetry: fn() },
  component: Card2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card2/States',
} satisfies Meta<typeof Card2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Integrações' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando integrações'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Não foi possível carregar as integrações',
      ),
    ).toBeVisible()
  },
}
