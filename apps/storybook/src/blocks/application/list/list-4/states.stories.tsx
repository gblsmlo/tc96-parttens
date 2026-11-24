import type { Meta, StoryObj } from '@storybook/react-vite'
import { List4 } from '@tc96/blocks/application/list/list-4'
import { expect, fn, within } from 'storybook/test'
import { integrations } from '../fixtures/list-4.ts'

const meta = {
  args: { integrations, onConnect: () => {}, onRetry: fn() },
  component: List4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List4/States',
} satisfies Meta<typeof List4>

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

export const Empty: Story = {
  args: { integrations: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Sem integrações'),
    ).toBeVisible()
  },
}
