import type { Meta, StoryObj } from '@storybook/react-vite'
import { List5 } from '@tc96/ui/blocks/application/list/list-5'
import { expect, fn, within } from 'storybook/test'
import { modules } from '../fixtures/list-5.ts'

const meta = {
  args: { modules, onAdd: () => {}, onBrowseMore: () => {}, onRetry: fn() },
  component: List5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List5/States',
} satisfies Meta<typeof List5>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Módulos disponíveis' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando módulos'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar os módulos'),
    ).toBeVisible()
  },
}
