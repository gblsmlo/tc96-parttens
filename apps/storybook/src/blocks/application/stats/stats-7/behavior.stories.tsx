import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stats7 } from '@tc96/blocks/application/stats/stats-7'
import { expect, within } from 'storybook/test'
import { stats7Metrics } from '../fixtures/stats-7.ts'

const meta = {
  args: { metrics: stats7Metrics },
  component: Stats7,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats7/Behavior',
} satisfies Meta<typeof Stats7>

export default meta

type Story = StoryObj<typeof meta>

export const MetricsShowCaptionAndFormattedValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const revenue = canvas.getByRole('region', { name: 'Receita' })
    await expect(revenue).toHaveTextContent('loja.tc96.io, 28 dias')
    await expect(revenue).toHaveTextContent(/R\$\s?\d+,\d\smil/)
    await expect(
      canvas.getByRole('region', { name: 'Licenças ativas' }),
    ).toHaveTextContent('3.276')
  },
}

export const CurrencyFollowsTheCurrencyProp: Story = {
  args: { currency: 'USD', locale: 'en-US' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Receita' }),
    ).toHaveTextContent(/\$\d+(\.\d)?K/)
  },
}

export const AreaChartsAreDecorative: Story = {
  play: async ({ canvasElement }) => {
    const charts = canvasElement.querySelectorAll(
      '[data-slot="area-metric-chart"]',
    )
    await expect(charts).toHaveLength(3)
    for (const chart of charts) {
      await expect(chart).toHaveAttribute('aria-hidden', 'true')
    }
  },
}
