import {
  ArrowDownIcon,
  ArrowUpIcon,
  EnvelopeSimpleIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlayIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { IconFrame } from '@tc96/ui/icon-frame'
import { cn } from '@tc96/utils'
import type { ComponentType } from 'react'
import type { GridFormatter } from '../../shared/grid/format'
import { buildSparklinePath } from './sparkline'
import type {
  Marketing1Campaign,
  Marketing1Channel,
  Marketing1DeltaDirection,
  Marketing1Labels,
} from './types'

const channelIcons = {
  display: ImageIcon,
  email: EnvelopeSimpleIcon,
  search: MagnifyingGlassIcon,
  social: UsersThreeIcon,
  video: PlayIcon,
} as const satisfies Record<
  Marketing1Channel,
  ComponentType<{ 'aria-hidden'?: 'true' }>
>

const deltaIcons = {
  down: ArrowDownIcon,
  flat: MinusIcon,
  up: ArrowUpIcon,
} as const

const deltaTones = {
  bad: 'text-destructive-foreground',
  flat: 'text-muted-foreground',
  good: 'text-success-foreground',
} as const

const sparklineBox = { height: 24, width: 72 }

export const countryFlag = (code: string): string =>
  /^[A-Za-z]{2}$/.test(code)
    ? [...code.toUpperCase()]
        .map((letter) =>
          String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65),
        )
        .join('')
    : ''

export const deltaDirection = (value: number): Marketing1DeltaDirection =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'flat'

export function CampaignCell({
  campaign,
  labels,
}: Readonly<{ campaign: Marketing1Campaign; labels: Marketing1Labels }>) {
  const Icon = channelIcons[campaign.channel]

  return (
    <div className="flex min-w-0 items-center gap-3">
      <IconFrame shape="rounded" size="sm">
        <Icon aria-hidden="true" />
        <span className="sr-only">{labels.channels[campaign.channel]}</span>
      </IconFrame>
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate font-medium">{campaign.name}</span>
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span aria-hidden="true">{countryFlag(campaign.country)}</span>
          <span>{campaign.country.toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{campaign.objective}</span>
        </span>
      </span>
    </div>
  )
}

export function DeltaText({
  favorableWhen,
  formatter,
  labels,
  value,
}: Readonly<{
  favorableWhen: 'down' | 'up'
  formatter: GridFormatter
  labels: Marketing1Labels
  value: number
}>) {
  const direction = deltaDirection(value)
  const Icon = deltaIcons[direction]
  const favorable = direction === favorableWhen
  const tone = direction === 'flat' ? 'flat' : favorable ? 'good' : 'bad'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs tabular-nums',
        deltaTones[tone],
      )}
      data-delta={direction}
      data-tone={tone}
    >
      <Icon aria-hidden="true" className="size-3" />
      <span className="sr-only">{labels.delta(direction, favorable)} </span>
      {formatter.delta(Math.abs(value)).replace(/^[+-]/, '')}
    </span>
  )
}

export function MetricWithDelta({
  delta,
  favorableWhen,
  formatter,
  labels,
  value,
}: Readonly<{
  delta: number
  favorableWhen: 'down' | 'up'
  formatter: GridFormatter
  labels: Marketing1Labels
  value: string
}>) {
  return (
    <span className="grid justify-items-end">
      <span className="tabular-nums">{value}</span>
      <DeltaText
        favorableWhen={favorableWhen}
        formatter={formatter}
        labels={labels}
        value={delta}
      />
    </span>
  )
}

export function SpendCell({
  campaign,
  formatter,
  labels,
}: Readonly<{
  campaign: Marketing1Campaign
  formatter: GridFormatter
  labels: Marketing1Labels
}>) {
  return (
    <span className="grid justify-items-end">
      <span className="tabular-nums">{formatter.money(campaign.spend)}</span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {labels.ofBudget(
          formatter.percent(
            campaign.budget > 0 ? campaign.spend / campaign.budget : 0,
          ),
        )}
      </span>
    </span>
  )
}

export function Sparkline({
  formatter,
  labels,
  points,
}: Readonly<{
  formatter: GridFormatter
  labels: Marketing1Labels
  points: readonly number[]
}>) {
  const first = points[0] ?? 0
  const last = points.at(-1) ?? 0

  return (
    <span className="inline-flex items-center">
      <svg
        aria-hidden="true"
        className={cn(
          'h-6 w-18 overflow-visible',
          last >= first
            ? 'text-success-foreground'
            : 'text-destructive-foreground',
        )}
        data-slot="sparkline"
        fill="none"
        viewBox={`0 0 ${sparklineBox.width} ${sparklineBox.height}`}
      >
        <path
          d={buildSparklinePath(points, sparklineBox)}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
      </svg>
      <span className="sr-only">
        {labels.trendSummary(formatter.number(first), formatter.number(last))}
      </span>
    </span>
  )
}

export function RoasCell({
  campaign,
  formatter,
  labels,
}: Readonly<{
  campaign: Marketing1Campaign
  formatter: GridFormatter
  labels: Marketing1Labels
}>) {
  const scale = Math.max(campaign.roas, campaign.roasTarget, 1) * 1.25
  const value = `${formatter.number(campaign.roas, 1)}x`
  const target = `${formatter.number(campaign.roasTarget, 1)}x`
  const reached = campaign.roas >= campaign.roasTarget

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="relative block h-2 w-16 shrink-0 rounded-full bg-muted"
        data-slot="bullet-bar"
      >
        <span
          className={cn(
            'absolute inset-y-0 start-0 block rounded-full',
            reached ? 'bg-success' : 'bg-warning',
          )}
          style={{ width: `${(campaign.roas / scale) * 100}%` }}
        />
        <span
          className="-inset-y-0.5 absolute block w-0.5 bg-foreground"
          style={{
            insetInlineStart: `${(campaign.roasTarget / scale) * 100}%`,
          }}
        />
      </span>
      <span aria-hidden="true" className="text-sm tabular-nums">
        {value}
      </span>
      <span className="sr-only">{labels.roasOfTarget(value, target)}</span>
    </div>
  )
}

export function ShareCell({
  formatter,
  labels,
  ratio,
}: Readonly<{
  formatter: GridFormatter
  labels: Marketing1Labels
  ratio: number
}>) {
  const percent = formatter.percent(ratio)

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="block h-2 w-16 shrink-0 overflow-hidden rounded-full bg-muted"
        data-slot="share-bar"
      >
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${Math.min(Math.max(ratio, 0), 1) * 100}%` }}
        />
      </span>
      <span aria-hidden="true" className="text-sm tabular-nums">
        {percent}
      </span>
      <span className="sr-only">{labels.newBuyersShare(percent)}</span>
    </div>
  )
}
