import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import {
  CardWidgetShell,
  clampRatio,
  formatAmount,
  IconFrame,
  MetricWidget,
  ProgressRing,
  StatList,
  TrendIndicator,
  WidgetPeriodToggle,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { CardPanel } from '@tc96/ui/card'
import { MeterPrimitive } from '@tc96/ui/meter'
import {
  CircleCheckIcon,
  CircleXIcon,
  DollarSignIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { type ReactElement, useId, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

type RecurringPeriod = 'arr' | 'mrr'
type SystemHealth = 'critical' | 'degraded' | 'healthy'

const wholeCurrency = { maximumFractionDigits: 0 }

const activeUsers = [
  1980, 2045, 2010, 2120, 2090, 2160, 2105, 2240, 2210, 2295, 2330, 2350,
]

const deviceRevenue = [
  { id: 'desktop', label: 'Desktop', value: 32450 },
  { id: 'mobile', label: 'Mobile', value: 12300 },
  { id: 'tablet', label: 'Tablet', value: 5250 },
]

const recurringPeriods = [
  { label: 'MRR', value: 'mrr' },
  { label: 'ARR', value: 'arr' },
] as const

const recurringLabels: Record<RecurringPeriod, string> = {
  arr: 'Annual recurring',
  mrr: 'Monthly recurring',
}

const healthStates = {
  critical: { icon: CircleXIcon, label: 'Critical', variant: 'error' },
  degraded: { icon: TriangleAlertIcon, label: 'Degraded', variant: 'warning' },
  healthy: { icon: CircleCheckIcon, label: 'Healthy', variant: 'success' },
} as const satisfies Record<
  SystemHealth,
  { icon: unknown; label: string; variant: 'error' | 'success' | 'warning' }
>

function Sparkline({
  label,
  values,
}: Readonly<{ label: string; values: readonly number[] }>): ReactElement {
  const gradientId = `sparkline-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const min = Math.min(...values)
  const range = Math.max(...values) - min || 1
  const step = values.length > 1 ? 100 / (values.length - 1) : 0
  const line = values
    .map(
      (value, index) => `${index * step},${36 - ((value - min) / range) * 32}`,
    )
    .join(' ')

  return (
    <svg
      aria-label={label}
      className="h-12 w-full"
      preserveAspectRatio="none"
      role="img"
      viewBox="0 0 100 40"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.24} />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon fill={`url(#${gradientId})`} points={`0,40 ${line} 100,40`} />
      <polyline
        fill="none"
        points={line}
        stroke="var(--chart-1)"
        strokeLinejoin="round"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function TrendCard() {
  return (
    <MetricWidget
      change={0.201}
      changeLabel="from last month"
      label="Total revenue"
      value={45231.89}
    />
  )
}

function SparklineCard() {
  return (
    <MetricWidget
      format={{ style: 'decimal' }}
      label="Active users"
      value={2350}
    >
      <Sparkline
        label="Active users over the last 12 weeks"
        values={activeUsers}
      />
    </MetricWidget>
  )
}

function ProgressCard({
  current = 7500,
  target = 10000,
}: Readonly<{ current?: number; target?: number }>) {
  const ratio = clampRatio(current, target)
  return (
    <MetricWidget format={wholeCurrency} label="Monthly goal" value={current}>
      <MeterPrimitive.Root
        aria-label="Monthly goal progress"
        className="grid gap-2"
        max={target}
        min={0}
        value={Math.min(current, target)}
      >
        <MeterPrimitive.Track className="block h-2 overflow-hidden rounded-full bg-muted">
          <MeterPrimitive.Indicator className="block h-full rounded-full bg-primary" />
        </MeterPrimitive.Track>
        <div className="flex justify-between gap-3 text-muted-foreground text-sm tabular-nums">
          <span>
            {formatAmount(ratio, {
              maximumFractionDigits: 0,
              style: 'percent',
            })}{' '}
            complete
          </span>
          <span>Target: {formatAmount(target, wholeCurrency)}</span>
        </div>
      </MeterPrimitive.Root>
    </MetricWidget>
  )
}

function ComparisonCard() {
  const titleId = useId()
  return (
    <CardWidgetShell aria-labelledby={titleId} data-widget="metric-comparison">
      <CardPanel className="grid gap-4 p-5">
        <h3 className="text-muted-foreground text-sm" id={titleId}>
          Revenue
        </h3>
        <StatList
          stats={[
            {
              id: 'current',
              label: 'This month',
              value: formatAmount(12450, wholeCurrency),
            },
            {
              id: 'previous',
              label: 'Last month',
              value: formatAmount(10230, wholeCurrency),
            },
          ]}
        />
      </CardPanel>
    </CardWidgetShell>
  )
}

function IconCard() {
  return (
    <MetricWidget
      change={0.201}
      changeLabel="from last month"
      format={wholeCurrency}
      icon={
        <IconFrame shape="rounded">
          <DollarSignIcon />
        </IconFrame>
      }
      label="Net revenue"
      value={45231}
    />
  )
}

function BreakdownCard() {
  const total = deviceRevenue.reduce((sum, segment) => sum + segment.value, 0)
  return (
    <MetricWidget
      format={wholeCurrency}
      label="Revenue by device"
      value={total}
    >
      <ul aria-label="Revenue by device" className="grid gap-2.5 text-sm">
        {deviceRevenue.map((segment, index) => (
          <li className="flex items-center gap-2" key={segment.id}>
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: `var(--chart-${index + 1})` }}
            />
            <span className="flex-1 truncate">{segment.label}</span>
            <span className="font-medium tabular-nums">
              {formatAmount(segment.value, wholeCurrency)}
            </span>
            <span className="w-12 text-end text-muted-foreground tabular-nums">
              {formatAmount(total ? segment.value / total : 0, {
                maximumFractionDigits: 1,
                style: 'percent',
              })}
            </span>
          </li>
        ))}
      </ul>
    </MetricWidget>
  )
}

function DonutCard({
  total = 100,
  used = 75,
}: Readonly<{ total?: number; used?: number }>) {
  const titleId = useId()
  const ratio = clampRatio(used, total)
  return (
    <CardWidgetShell aria-labelledby={titleId} data-widget="metric-donut">
      <CardPanel className="grid gap-4 p-5">
        <h3 className="text-muted-foreground text-sm" id={titleId}>
          Storage used
        </h3>
        <div className="flex items-center gap-4">
          <ProgressRing className="size-14" ratio={ratio} strokeWidth={12}>
            <span className="font-medium text-xs tabular-nums">
              {formatAmount(ratio, {
                maximumFractionDigits: 0,
                style: 'percent',
              })}
            </span>
          </ProgressRing>
          <div className="grid gap-0.5">
            <span className="font-medium text-2xl tabular-nums">{used} GB</span>
            <span className="text-muted-foreground text-sm">of {total} GB</span>
          </div>
        </div>
      </CardPanel>
    </CardWidgetShell>
  )
}

function StatusCard({
  health = 'healthy',
  label = 'System status',
  uptime = 0.999,
}: Readonly<{ health?: SystemHealth; label?: string; uptime?: number }>) {
  const state = healthStates[health]
  const Icon = state.icon
  return (
    <MetricWidget
      changeLabel={
        <Badge size="lg" variant={state.variant}>
          <Icon aria-hidden="true" />
          {state.label}
        </Badge>
      }
      format={{ maximumFractionDigits: 1, style: 'percent' }}
      label={label}
      value={uptime}
    />
  )
}

function ToggleCard({ mrr = 12450 }: Readonly<{ mrr?: number }>) {
  const [period, setPeriod] = useState<RecurringPeriod>('mrr')
  return (
    <MetricWidget
      changeLabel={recurringLabels[period]}
      format={wholeCurrency}
      icon={
        <WidgetPeriodToggle
          aria-label="Recurring revenue period"
          onValueChange={setPeriod}
          options={recurringPeriods}
          value={period}
        />
      }
      label={period === 'mrr' ? 'MRR' : 'ARR'}
      value={period === 'mrr' ? mrr : mrr * 12}
    />
  )
}

function AccentBorderCard() {
  return (
    <MetricWidget
      changeLabel="vs last week"
      className="border-s-2 border-s-success"
      format={wholeCurrency}
      icon={<TrendIndicator value={0.125} />}
      label="Total sales"
      value={23456}
    />
  )
}

const single =
  (width: string): Decorator =>
  (Story) => (
    <div className="grid min-h-screen place-items-center p-6">
      <div className={`w-full ${width}`}>
        <Story />
      </div>
    </div>
  )

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          'Ten stat cards composed from the widget building blocks, with no new pattern code: `MetricWidget` carries the label, value, trend and an `icon` slot, and its `children` take a sparkline, a `Meter`, a breakdown list or a status `Badge`. `StatList` puts two periods side by side, `ProgressRing` draws the donut, `WidgetPeriodToggle` switches MRR and ARR, and the accent border is a consumer `className` on the shell.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/Stats',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="grid min-h-screen place-items-center p-6 sm:p-10">
      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2">
        <TrendCard />
        <SparklineCard />
        <ProgressCard />
        <ComparisonCard />
        <IconCard />
        <BreakdownCard />
        <DonutCard />
        <StatusCard />
        <ToggleCard />
        <AccentBorderCard />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('region')).toHaveLength(10)
  },
}

export const WithTrend: Story = {
  decorators: [single('max-w-sm')],
  render: () => <TrendCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Total revenue',
    })
    await expect(card).toHaveTextContent('$45,231.89')
    await expect(card).toHaveTextContent('Alta de 20.10%')
  },
}

export const WithSparkline: Story = {
  decorators: [single('max-w-sm')],
  render: () => <SparklineCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Active users',
    })
    await expect(card).toHaveTextContent('2,350')
    await expect(
      within(card).getByRole('img', {
        name: 'Active users over the last 12 weeks',
      }),
    ).toBeInTheDocument()
  },
}

export const WithProgress: Story = {
  decorators: [single('max-w-sm')],
  render: () => <ProgressCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Monthly goal',
    })
    await expect(
      within(card).getByRole('meter', { name: 'Monthly goal progress' }),
    ).toHaveAttribute('aria-valuenow', '7500')
    await expect(card).toHaveTextContent('75% complete')
    await expect(card).toHaveTextContent('Target: $10,000')
  },
}

export const WithComparison: Story = {
  decorators: [single('max-w-sm')],
  render: () => <ComparisonCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', { name: 'Revenue' })
    await expect(
      within(card).getByText('This month', { selector: 'dt' })
        .nextElementSibling,
    ).toHaveTextContent('$12,450')
    await expect(
      within(card).getByText('Last month', { selector: 'dt' })
        .nextElementSibling,
    ).toHaveTextContent('$10,230')
  },
}

export const WithIcon: Story = {
  decorators: [single('max-w-sm')],
  render: () => <IconCard />,
}

export const WithBreakdown: Story = {
  decorators: [single('max-w-sm')],
  render: () => <BreakdownCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Revenue by device',
    })
    await expect(card).toHaveTextContent('$50,000')
    const items = within(card).getAllByRole('listitem')
    await expect(items).toHaveLength(3)
    await expect(items[0]).toHaveTextContent('Desktop$32,45064.9%')
  },
}

export const WithDonut: Story = {
  decorators: [single('max-w-sm')],
  render: () => <DonutCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Storage used',
    })
    await expect(card).toHaveTextContent('75 GB')
    await expect(card).toHaveTextContent('of 100 GB')
  },
}

export const WithStatus: Story = {
  decorators: [single('max-w-sm')],
  render: () => (
    <div className="grid gap-4">
      <StatusCard label="API" />
      <StatusCard health="degraded" label="Database" uptime={0.982} />
      <StatusCard health="critical" label="Queue" uptime={0.874} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'API' })).toHaveTextContent(
      '99.9%Healthy',
    )
    await expect(
      canvas.getByRole('region', { name: 'Database' }),
    ).toHaveTextContent('Degraded')
    await expect(
      canvas.getByRole('region', { name: 'Queue' }),
    ).toHaveTextContent('Critical')
  },
}

export const WithToggle: Story = {
  decorators: [single('max-w-sm')],
  render: () => <ToggleCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'MRR' })).toHaveTextContent(
      '$12,450Monthly recurring',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'ARR' }))
    await expect(canvas.getByRole('region', { name: 'ARR' })).toHaveTextContent(
      '$149,400Annual recurring',
    )
  },
}

export const WithAccentBorder: Story = {
  decorators: [single('max-w-sm')],
  render: () => <AccentBorderCard />,
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', {
      name: 'Total sales',
    })
    await expect(card).toHaveTextContent('$23,456')
    await expect(
      card.querySelector('[data-slot="trend-indicator"]'),
    ).toHaveAttribute('data-direction', 'up')
  },
}
