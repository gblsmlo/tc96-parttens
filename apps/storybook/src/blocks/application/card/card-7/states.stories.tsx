import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card7 } from '@tc96/blocks/application/card/card-7'
import { expect, fn, within } from 'storybook/test'
import { contact, items, stats } from '../fixtures/card-7.tsx'

const meta = {
  args: {
    className: 'max-w-sm',
    contact,
    items,
    onAction: fn(),
    onRetry: fn(),
    stats,
  },
  component: Card7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card7/States',
} satisfies Meta<typeof Card7>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Mara Alves' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando contato'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar o contato'),
    ).toBeVisible()
  },
}
