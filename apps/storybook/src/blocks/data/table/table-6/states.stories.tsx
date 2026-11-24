import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table6 } from '@tc96/ui/blocks/data/table/table-6'
import { expect, fn, within } from 'storybook/test'
import { accounts, regions, summary } from '../fixtures/table-6.ts'

const meta = {
  args: { accounts, onRetry: fn(), regions, summary },
  component: Table6,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Table/Table6/States',
} satisfies Meta<typeof Table6>

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
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as contas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Receita por região' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { accounts: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma conta para exibir.'),
    ).toBeVisible()
  },
}
