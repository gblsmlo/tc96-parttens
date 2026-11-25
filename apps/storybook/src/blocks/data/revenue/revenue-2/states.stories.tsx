import type { Meta, StoryObj } from '@storybook/react-vite'
import { Revenue2 } from '@tc96/ui/blocks/data/revenue/revenue-2'
import { expect, fn, within } from 'storybook/test'
import { renewals } from '../fixtures/revenue-2.ts'

const meta = {
  args: { onRetry: fn(), pageSize: 8, renewals },
  component: Revenue2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue2/States',
} satisfies Meta<typeof Revenue2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('table')).toBeVisible()
  },
}

export const Selected: Story = {
  args: { selectedIds: ['atlas', 'base-nuvem'] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('toolbar', {
        name: 'Ações das renovações selecionadas',
      }),
    ).toHaveTextContent('2 renovações selecionadas')
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando renovações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('heading', { name: 'Revisão de renovações' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as renovações'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Revisão de renovações' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { renewals: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma renovação para exibir.'),
    ).toBeVisible()
  },
}
