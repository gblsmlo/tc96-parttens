import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataGrid9 } from '@tc96/ui/blocks/data/data-grid/data-grid-9'
import { expect, fn, within } from 'storybook/test'
import {
  campaigns,
  pageSizeOptions,
  period,
  summary,
  views,
} from '../fixtures/data-grid-9.ts'

const meta = {
  args: {
    activeViewId: 'all',
    campaigns,
    onRetry: fn(),
    pageSize: 8,
    pageSizeOptions,
    period,
    summary,
    views,
  },
  component: DataGrid9,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/DataGrid/DataGrid9/States',
} satisfies Meta<typeof DataGrid9>

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
    await expect(canvas.getByLabelText('Carregando campanhas')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Desempenho de campanhas' }),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as campanhas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Desempenho de campanhas' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { campaigns: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma campanha para exibir.'),
    ).toBeVisible()
  },
}
