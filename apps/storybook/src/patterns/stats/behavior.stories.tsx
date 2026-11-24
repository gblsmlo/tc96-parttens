import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import {
  AreaMetricWidget,
  MetricWidget,
  TrendIndicator,
} from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { StatsCanvas } from './stats-canvas.tsx'

const meta = {
  decorators: [StatsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Stats/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const card = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('region', { name })

export const NamesTheRegionByItsLabel: Story = {
  render: () => <MetricWidget label="Total revenue" value={45231.89} />,
  play: async ({ canvasElement }) => {
    const region = card(canvasElement, 'Total revenue')
    await expect(region).toHaveAttribute('data-widget', 'metric')
    await expect(region).toHaveAttribute('data-tone', 'default')
    await expect(region).toHaveTextContent('$45,231.89')
  },
}

export const FormatsANumericValue: Story = {
  render: () => (
    <div className="grid gap-4">
      <MetricWidget label="Revenue" value={45231.89} />
      <MetricWidget
        format={{ maximumFractionDigits: 1, style: 'percent' }}
        label="Uptime"
        value={0.999}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'Revenue')).toHaveTextContent('$45,231.89')
    await expect(card(canvasElement, 'Uptime')).toHaveTextContent('99.9%')
  },
}

export const ShowsTheTrendWithItsDirection: Story = {
  render: () => (
    <div className="grid gap-4">
      <MetricWidget
        change={0.201}
        changeLabel="from last month"
        label="Revenue"
        value={45231.89}
      />
      <MetricWidget change={-0.05} label="Churn" value={120} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const revenue = card(canvasElement, 'Revenue')
    await expect(revenue).toHaveTextContent('Alta de 20.10%')
    await expect(revenue).toHaveTextContent('from last month')
    await expect(
      revenue.querySelector('[data-slot="trend-indicator"]'),
    ).toHaveAttribute('data-direction', 'up')
    const churn = card(canvasElement, 'Churn')
    await expect(churn).toHaveTextContent('Queda de 5.00%')
    await expect(
      churn.querySelector('[data-slot="trend-indicator"]'),
    ).toHaveAttribute('data-direction', 'down')
  },
}

export const OmitsTheTrendRowWithoutChange: Story = {
  render: () => <MetricWidget label="Orders" value={1280} />,
  play: async ({ canvasElement }) => {
    const region = card(canvasElement, 'Orders')
    await expect(
      region.querySelector('[data-slot="trend-indicator"]'),
    ).toBeNull()
    await expect(region.querySelector('[data-slot="amount"]')).not.toBeNull()
  },
}

export const RendersANodeValueAsIs: Story = {
  render: () => <MetricWidget label="Status" value={<strong>Online</strong>} />,
  play: async ({ canvasElement }) => {
    const region = card(canvasElement, 'Status')
    await expect(within(region).getByText('Online')).toBeVisible()
    await expect(region.querySelector('[data-slot="amount"]')).toBeNull()
  },
}

export const AcceptsANodeAsTheChangeLabel: Story = {
  render: () => (
    <MetricWidget
      changeLabel={
        <Badge size="large" variant="success">
          Healthy
        </Badge>
      }
      format={{ maximumFractionDigits: 1, style: 'percent' }}
      label="System status"
      value={0.999}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(card(canvasElement, 'System status')).toHaveTextContent(
      '99.9%Healthy',
    )
  },
}

export const PlacesTheIconBesideTheLabelAndChildrenBelow: Story = {
  render: () => (
    <MetricWidget
      icon={<TrendIndicator value={0.125} />}
      label="Total sales"
      value={23456}
    >
      <p>Chart area</p>
    </MetricWidget>
  ),
  play: async ({ canvasElement }) => {
    const region = card(canvasElement, 'Total sales')
    const header = region.querySelector('h3')?.parentElement
    await expect(
      header?.querySelector('[data-slot="trend-indicator"]'),
    ).toHaveAttribute('data-direction', 'up')
    await expect(within(region).getByText('Chart area')).toBeVisible()
  },
}

export const ForwardsClassNameToTheFrame: Story = {
  render: () => (
    <MetricWidget
      className="border-s-2 border-s-success"
      label="Total sales"
      value={23456}
    />
  ),
  play: async ({ canvasElement }) => {
    const region = card(canvasElement, 'Total sales')
    await expect(region).toHaveClass('border-s-2')
    await expect(region).toHaveClass('border-s-success')
  },
}

export const InvertedWrapsTheCardInTheDarkTheme: Story = {
  render: () => (
    <MetricWidget label="Conversion" tone="inverted" value={0.24} />
  ),
  play: async ({ canvasElement }) => {
    const scope = canvasElement.querySelector(
      '[data-slot="metric-widget-scope"]',
    )
    await expect(scope).toHaveClass('dark')
    await expect(scope).toHaveClass('contents')
    await expect(card(canvasElement, 'Conversion')).toHaveAttribute(
      'data-tone',
      'inverted',
    )
  },
}

export const AreaMetricNamesTheRegionAndHidesTheChart: Story = {
  render: () => (
    <AreaMetricWidget
      caption="Last 28 days"
      format={{ style: 'decimal' }}
      label="Signups"
      points={[120, 140, 132, 168, 150]}
      value={4238}
    />
  ),
  play: async ({ canvasElement }) => {
    const region = card(canvasElement, 'Signups')
    await expect(region).toHaveAttribute('data-widget', 'area-metric')
    await expect(region).toHaveTextContent('Last 28 days')
    await expect(region).toHaveTextContent('4,238')
    const chart = region.querySelector('[data-slot="area-metric-chart"]')
    await expect(chart).toHaveAttribute('aria-hidden', 'true')
    await expect(chart?.querySelector('svg.recharts-surface')).not.toBeNull()
  },
}

export const AreaMetricDropsTheChartBelowTwoPoints: Story = {
  render: () => (
    <AreaMetricWidget label="Licenses" points={[3297]} value={3297} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      card(canvasElement, 'Licenses').querySelector(
        '[data-slot="area-metric-chart"]',
      ),
    ).toBeNull()
  },
}
