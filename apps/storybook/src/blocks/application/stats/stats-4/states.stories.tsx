import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats4 } from '@tc96/ui/blocks/application/stats/stats-4'
import { expect, fn, within } from 'storybook/test'
import { leadsOverview } from '../fixtures/stats-4.ts'

const meta = {
  args: {
    goal: leadsOverview.goal,
    onRangeChange: fn(),
    range: '30d',
    sources: leadsOverview.sources,
    total: leadsOverview.total,
    onRetry: fn(),
  },
  component: Stats4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats4/States',
} satisfies Meta<typeof Stats4>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', {
        name: 'Visão geral de leads',
      }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando leads'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorState: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar os leads'),
    ).toBeVisible()
  },
}
