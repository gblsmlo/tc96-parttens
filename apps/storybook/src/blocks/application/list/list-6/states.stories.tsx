import type { Meta, StoryObj } from '@storybook/react-vite'
import { List6 } from '@tc96/blocks/application/list/list-6'
import { expect, fn, within } from 'storybook/test'
import { movers } from '../fixtures/list-6.ts'

const meta = {
  args: { movers, onQueryChange: () => {}, query: '', onRetry: fn() },
  component: List6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List6/States',
} satisfies Meta<typeof List6>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando ativos'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar os ativos'),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { movers: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Sem ativos')).toBeVisible()
  },
}
