import {
  ClockIcon,
  DotsThreeIcon,
  FunnelSimpleIcon,
  LightningIcon,
  PulseIcon,
  SlidersHorizontalIcon,
  TagIcon,
  UsersIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import type { ComponentType } from 'react'
import { DataSelect } from '../../shared/properties/data-properties'
import type { TableFormatter } from '../../shared/table/format'
import type {
  Support4Labels,
  Support4RowAction,
  Support4Rule,
  Support4RuleIcon,
} from './types'

const ruleIcons = {
  alert: WarningIcon,
  clock: ClockIcon,
  people: UsersIcon,
  sliders: SlidersHorizontalIcon,
  tag: TagIcon,
} as const satisfies Record<
  Support4RuleIcon,
  ComponentType<{ 'aria-hidden'?: 'true' }>
>

const tone = (rule: Support4Rule) =>
  rule.enabled ? 'text-foreground' : 'text-muted-foreground'

export function RankCell({
  position,
  rule,
}: Readonly<{ position: number; rule: Support4Rule }>) {
  return (
    <span
      className={cn('tabular-nums', tone(rule))}
      data-disabled={rule.enabled ? undefined : ''}
      data-slot="support-4-rank"
    >
      {position}
    </span>
  )
}

export function RuleCell({ rule }: Readonly<{ rule: Support4Rule }>) {
  const Icon = ruleIcons[rule.icon]

  return (
    <div
      className="flex min-w-0 items-center gap-3"
      data-disabled={rule.enabled ? undefined : ''}
    >
      <IconFrame shape="rounded" size="sm">
        <Icon aria-hidden="true" />
      </IconFrame>
      <span className="grid min-w-0 gap-0.5">
        <span className={cn('truncate font-medium', tone(rule))}>
          {rule.name}
        </span>
        <span className="truncate text-muted-foreground text-xs">
          {rule.description}
        </span>
      </span>
    </div>
  )
}

export function ScopeCell({
  ariaLabel,
  rule,
}: Readonly<{ ariaLabel: string; rule: Support4Rule }>) {
  const { label, tone = 'neutral' } = rule.scope

  return (
    <DataSelect
      ariaLabel={ariaLabel}
      options={[{ label, tone: rule.enabled ? tone : 'neutral', value: label }]}
      value={label}
    />
  )
}

export function ClauseCell({
  kind,
  rule,
}: Readonly<{ kind: 'condition' | 'effect'; rule: Support4Rule }>) {
  const Icon = kind === 'condition' ? FunnelSimpleIcon : LightningIcon

  return (
    <span className={cn('flex min-w-0 items-center gap-1.5', tone(rule))}>
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span className="truncate">{rule[kind]}</span>
    </span>
  )
}

export function MatchesCell({
  formatter,
  labels,
  rule,
}: Readonly<{
  formatter: TableFormatter
  labels: Support4Labels
  rule: Support4Rule
}>) {
  const matches = formatter.number(rule.matches)

  return (
    <span className={cn('flex items-center gap-1.5', tone(rule))}>
      <PulseIcon aria-hidden="true" className="size-4 shrink-0" />
      <span aria-hidden="true" className="font-medium tabular-nums">
        {matches}
      </span>
      <span aria-hidden="true" className="text-muted-foreground text-xs">
        {labels.period}
      </span>
      <span className="sr-only">{labels.matchesIn(matches)}</span>
    </span>
  )
}

export function EnabledCell({
  labels,
  onEnabledChange,
  rule,
}: Readonly<{
  labels: Support4Labels
  onEnabledChange?: (ruleId: string, enabled: boolean) => void
  rule: Support4Rule
}>) {
  return (
    <Switch
      aria-label={labels.enabledFor(rule.name)}
      checked={rule.enabled}
      disabled={!onEnabledChange}
      onCheckedChange={(checked) => onEnabledChange?.(rule.id, checked)}
    />
  )
}

export function RowActionsCell({
  actions,
  labels,
  onRowAction,
  rule,
}: Readonly<{
  actions: Support4RowAction[]
  labels: Support4Labels
  onRowAction: (actionId: string, ruleId: string) => void
  rule: Support4Rule
}>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.rowActionsFor(rule.name)}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {actions.map((action) => (
          <MenuItem
            key={action.id}
            onClick={() => onRowAction(action.id, rule.id)}
            variant={action.destructive ? 'destructive' : undefined}
          >
            {action.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}
