import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid2 } from '@tc96/ui/blocks/data/data-grid/data-grid-2'
import { expect, fn, within } from 'storybook/test'
import { members, pageSizeOptions, views } from '../fixtures/data-grid-2.ts'

const meta = {
  args: {
    activeViewId: 'all',
    members,
    onRetry: fn(),
    pageSize: 8,
    pageSizeOptions,
    views,
  },
  component: DataGrid2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid2/States',
} satisfies Meta<typeof DataGrid2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('grid')).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando membros')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os membros'),
    ).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Membros' })).toBeVisible()
  },
}

export const Empty: Story = {
  args: { members: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum membro para exibir.'),
    ).toBeVisible()
  },
}
