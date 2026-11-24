import {
  ChartLineIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  InfoIcon,
  PushPinIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { Gauge } from '@tc96/ui/gauge'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { MeterPrimitive } from '@tc96/ui/meter'
import {
  type AmountFormatOptions,
  clampRatio,
  formatAmount,
  IconFrame,
  MetricWidget,
  ProgressRing,
  StatList,
  TrendIndicator,
  WidgetPeriodToggle,
  WidgetShell,
} from '@tc96/ui/patterns'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { type ReactElement, useId, useState } from 'react'
import type { StatsControls, StatsFormatName } from './stats-controls.ts'
import {
  activeUsers,
  deviceRevenue,
  type LeadsPeriod,
  leadsByPeriod,
  leadsPeriods,
  type RecurringPeriod,
  recurringLabels,
  recurringPeriods,
  type SystemHealth,
  wholeCurrency,
} from './stats-data.ts'

const statsFormats: Record<StatsFormatName, AmountFormatOptions | undefined> = {
  currency: undefined,
  decimal: { style: 'decimal' },
  percent: { maximumFractionDigits: 1, style: 'percent' },
  wholeCurrency,
}

const healthStates = {
  critical: { icon: XCircleIcon, label: 'Critical', variant: 'error' },
  degraded: { icon: WarningIcon, label: 'Degraded', variant: 'warning' },
  healthy: { icon: CheckCircleIcon, label: 'Healthy', variant: 'success' },
} as const satisfies Record<
  SystemHealth,
  { icon: unknown; label: string; variant: 'error' | 'success' | 'warning' }
>

export function Sparkline({
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

export function ComposedMetric({
  change,
  changeLabel,
  format,
  icon,
  label,
  sparkline,
  tone,
  trend,
  value,
}: Readonly<StatsControls>): ReactElement {
  return (
    <MetricWidget
      change={trend ? change : undefined}
      changeLabel={changeLabel || undefined}
      format={statsFormats[format]}
      icon={
        icon ? (
          <IconFrame shape="rounded">
            <CurrencyDollarIcon aria-hidden="true" />
          </IconFrame>
        ) : undefined
      }
      label={label}
      tone={tone}
      value={value}
    >
      {sparkline ? (
        <Sparkline
          label={`${label} over the last 12 weeks`}
          values={activeUsers}
        />
      ) : null}
    </MetricWidget>
  )
}

export function ProgressCard({
  current = 7500,
  target = 10000,
}: Readonly<{ current?: number; target?: number }>): ReactElement {
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

export function ComparisonCard(): ReactElement {
  const titleId = useId()
  return (
    <WidgetShell aria-labelledby={titleId} data-widget="metric-comparison">
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
    </WidgetShell>
  )
}

export function BreakdownCard(): ReactElement {
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

export function DonutCard({
  total = 100,
  used = 75,
}: Readonly<{ total?: number; used?: number }>): ReactElement {
  const titleId = useId()
  const ratio = clampRatio(used, total)
  return (
    <WidgetShell aria-labelledby={titleId} data-widget="metric-donut">
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
    </WidgetShell>
  )
}

export function StatusCard({
  health = 'healthy',
  label = 'System status',
  uptime = 0.999,
}: Readonly<{
  health?: SystemHealth
  label?: string
  uptime?: number
}>): ReactElement {
  const state = healthStates[health]
  const Icon = state.icon
  return (
    <MetricWidget
      changeLabel={
        <Badge size="large" variant={state.variant}>
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

export function ToggleCard({
  mrr = 12450,
}: Readonly<{ mrr?: number }>): ReactElement {
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

export function AccentBorderCard(): ReactElement {
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

export function ActionsCard(): ReactElement {
  return (
    <MetricWidget
      change={0.084}
      changeLabel="from last month"
      format={wholeCurrency}
      icon={
        <Menu>
          <MenuTrigger
            aria-label="Total revenue actions"
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <DotsThreeIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuPopup align="end">
            <MenuItem>
              <ChartLineIcon aria-hidden="true" />
              View report
            </MenuItem>
            <MenuItem>
              <DownloadSimpleIcon aria-hidden="true" />
              Export CSV
            </MenuItem>
            <MenuItem>
              <PushPinIcon aria-hidden="true" />
              Pin to dashboard
            </MenuItem>
          </MenuPopup>
        </Menu>
      }
      label="Total revenue"
      value={48250}
    />
  )
}

export function PreviousPeriodCard({
  change = 0.151,
  label = 'All orders',
  previous = 105922,
  value = 122380,
}: Readonly<{
  change?: number
  label?: string
  previous?: number
  value?: number
}>): ReactElement {
  const count: AmountFormatOptions = { style: 'decimal' }
  return (
    <MetricWidget
      icon={
        <Menu>
          <MenuTrigger
            aria-label={`${label} actions`}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <DotsThreeIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuPopup align="end">
            <MenuItem>
              <ChartLineIcon aria-hidden="true" />
              View report
            </MenuItem>
            <MenuItem>
              <DownloadSimpleIcon aria-hidden="true" />
              Export CSV
            </MenuItem>
          </MenuPopup>
        </Menu>
      }
      label={label}
      value={
        <span className="flex flex-wrap items-center gap-2.5">
          {formatAmount(value, count)}
          <TrendIndicator value={change} />
        </span>
      }
    >
      <p className="border-t pt-3 text-muted-foreground text-sm">
        Vs last month:{' '}
        <span className="font-medium text-foreground tabular-nums">
          {formatAmount(previous, count)}
        </span>
      </p>
    </MetricWidget>
  )
}

const LEAD_SEGMENTS = 30

export function LeadsOverviewCard(): ReactElement {
  const titleId = useId()
  const [period, setPeriod] = useState<LeadsPeriod>('month')
  const { conversion, newLeads, returning, source } = leadsByPeriod[period]
  const total = newLeads + returning
  const newShare = clampRatio(newLeads, total)
  const share: AmountFormatOptions = {
    maximumFractionDigits: 2,
    style: 'percent',
  }

  return (
    <WidgetShell aria-labelledby={titleId} data-widget="leads-overview">
      <CardPanel className="grid gap-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-base" id={titleId}>
            Leads overview
          </h3>
          <Select
            items={leadsPeriods}
            onValueChange={(value) => {
              if (value) setPeriod(value)
            }}
            value={period}
          >
            <SelectTrigger aria-label="Leads period" className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {leadsPeriods.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 sm:divide-x">
          <div className="grid content-start gap-3 sm:pe-5">
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-3xl tabular-nums">
                  {formatAmount(newLeads, { style: 'decimal' })}
                </span>
                <Badge variant="info">{formatAmount(newShare, share)}</Badge>
              </div>
              <span className="text-muted-foreground text-sm">New leads</span>
            </div>
            <Gauge
              aria-label="Share of new leads"
              max={total}
              tone="foreground"
              value={newLeads}
            />
            <dl className="grid gap-0.5 text-sm">
              <dt className="text-muted-foreground">Top source</dt>
              <dd className="font-medium">{source}</dd>
            </dl>
          </div>
          <div className="grid content-start gap-3">
            <div className="grid gap-1">
              <span className="font-semibold text-3xl tabular-nums">
                {formatAmount(returning, { style: 'decimal' })}
              </span>
              <span className="text-muted-foreground text-sm">
                Returning leads
              </span>
            </div>
            <Gauge
              aria-label="Share of returning leads"
              max={total}
              segments={LEAD_SEGMENTS}
              tone="success"
              value={returning}
              variant="segmented"
            />
            <dl className="grid gap-0.5 text-sm">
              <dt className="flex items-center gap-1 text-muted-foreground">
                Conversion rate
                <Tooltip>
                  <TooltipTrigger
                    aria-label="About conversion rate"
                    render={<Button size="icon-sm" variant="ghost" />}
                  >
                    <InfoIcon aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipPopup>
                    Leads that became customers in the period
                  </TooltipPopup>
                </Tooltip>
              </dt>
              <dd className="font-medium tabular-nums">
                {formatAmount(conversion, {
                  maximumFractionDigits: 1,
                  style: 'percent',
                })}
              </dd>
            </dl>
          </div>
        </div>
      </CardPanel>
    </WidgetShell>
  )
}
