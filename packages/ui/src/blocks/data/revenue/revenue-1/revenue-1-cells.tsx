import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { getInitials } from '@tc96/ui/helpers/initials'
import { IconFrame } from '@tc96/ui/icon-frame'
import type { SelectPropertyOption } from '@tc96/ui/patterns/properties/display/select/select-property'
import { cn } from '@tc96/utils'
import type { GridFormatter } from '../../shared/grid/format'
import { DataSelect } from '../../shared/properties/data-properties'
import type {
  Revenue1Health,
  Revenue1Labels,
  Revenue1Renewal,
  Revenue1Risk,
  Revenue1Stage,
  Revenue1Urgency,
} from './types'

const selectedText = 'group-data-[state=selected]:text-foreground'

const healthBars = {
  'at-risk': 'bg-destructive',
  healthy: 'bg-success',
  watchlist: 'bg-warning',
} as const satisfies Record<Revenue1Health, string>

export const revenue1RiskRank = {
  critical: 3,
  high: 2,
  low: 0,
  medium: 1,
} as const satisfies Record<Revenue1Risk, number>

export const healthLevel = (health: number): Revenue1Health =>
  health < 0.55 ? 'at-risk' : health < 0.75 ? 'watchlist' : 'healthy'

export const urgencyOf = (days: number): Revenue1Urgency =>
  days < 0 ? 'overdue' : days <= 30 ? 'soon' : 'later'

const dueTone = (days: number) =>
  days <= 14
    ? 'text-destructive-foreground'
    : days <= 30
      ? 'text-warning-foreground'
      : 'text-foreground'

export function AccountCell({
  labels,
  renewal,
}: Readonly<{ labels: Revenue1Labels; renewal: Revenue1Renewal }>) {
  const { account, owner } = renewal

  return (
    <div className="flex min-w-0 items-center gap-3">
      <IconFrame shape="rounded" size="sm">
        {account.logoUrl ? (
          <img alt="" className="size-5 object-contain" src={account.logoUrl} />
        ) : (
          <span aria-hidden="true" className="font-semibold text-sm">
            {getInitials(account.name).slice(0, 1)}
          </span>
        )}
      </IconFrame>
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate font-medium">{account.name}</span>
        <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs">
          <span aria-hidden="true" className="text-foreground">
            <Avatar className="size-4">
              {owner.imageUrl ? (
                <AvatarImage alt="" src={owner.imageUrl} />
              ) : null}
              <AvatarFallback className="text-[0.5rem]">
                {getInitials(owner.label)}
              </AvatarFallback>
            </Avatar>
          </span>
          <span className="truncate">{owner.label}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{labels.segments[account.segment]}</span>
        </span>
      </span>
    </div>
  )
}

export function RenewalCell({
  formatter,
  labels,
  renewal,
}: Readonly<{
  formatter: GridFormatter
  labels: Revenue1Labels
  renewal: Revenue1Renewal
}>) {
  const urgency = urgencyOf(renewal.dueInDays)

  return (
    <span className="grid min-w-0 gap-0.5">
      <span
        className={cn(
          'truncate font-medium',
          dueTone(renewal.dueInDays),
          selectedText,
        )}
        data-urgency={urgency}
      >
        {labels.due(urgency, renewal.dueInDays)}
      </span>
      <span className="truncate text-muted-foreground text-xs tabular-nums">
        {formatter.date(renewal.renewalDate)}
      </span>
    </span>
  )
}

export function ArrCell({
  formatter,
  labels,
  renewal,
}: Readonly<{
  formatter: GridFormatter
  labels: Revenue1Labels
  renewal: Revenue1Renewal
}>) {
  const hasUpside = renewal.upside > 0

  return (
    <span className="grid min-w-0 gap-0.5">
      <span className="font-medium tabular-nums">
        {formatter.money(renewal.arr)}
      </span>
      <span
        className={cn(
          'truncate text-xs tabular-nums',
          hasUpside
            ? cn('text-success-foreground', selectedText)
            : 'text-muted-foreground',
        )}
        data-upside={hasUpside ? 'positive' : 'none'}
      >
        {labels.upside(formatter.money(renewal.upside))}
      </span>
    </span>
  )
}

export function HealthCell({
  formatter,
  health,
  labels,
}: Readonly<{
  formatter: GridFormatter
  health: number
  labels: Revenue1Labels
}>) {
  const level = healthLevel(health)
  const percent = formatter.percent(health)

  return (
    <div className="grid min-w-0 gap-1" data-health={level}>
      <div aria-hidden="true" className="flex items-center gap-2">
        <span className="block h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
          <span
            className={cn('block h-full rounded-full', healthBars[level])}
            style={{ width: `${Math.min(Math.max(health, 0), 1) * 100}%` }}
          />
        </span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {percent}
        </span>
      </div>
      <span aria-hidden="true" className="text-muted-foreground text-xs">
        {labels.health[level]}
      </span>
      <span className="sr-only">
        {labels.healthScore(percent, labels.health[level])}
      </span>
    </div>
  )
}

export function StageCell({
  labels,
  options,
  stage,
}: Readonly<{
  labels: Revenue1Labels
  options: readonly SelectPropertyOption[]
  stage: Revenue1Stage
}>) {
  return (
    <DataSelect
      ariaLabel={labels.columns.stage}
      options={options}
      value={stage}
    />
  )
}

export function RiskCell({
  labels,
  options,
  risk,
}: Readonly<{
  labels: Revenue1Labels
  options: readonly SelectPropertyOption[]
  risk: Revenue1Risk
}>) {
  return (
    <DataSelect
      ariaLabel={labels.columns.risk}
      options={options}
      value={risk}
    />
  )
}
