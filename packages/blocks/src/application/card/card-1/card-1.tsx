import { AvatarStack } from '@tc96/parttens/widgets/shared/avatar-stack'
import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { CardPanel } from '@tc96/ui/card'
import { IconFrame } from '@tc96/ui/icon-frame'
import { CardBadge } from '../shared/card-badge'
import { defaultCard1Labels } from './labels'
import type { Card1Accent, Card1Fact, Card1Props } from './types'

function FactAccent({
  accent,
  label,
}: Readonly<{ accent: Card1Accent; label: string }>) {
  if (accent.kind === 'badge') return <CardBadge {...accent.badge} />
  if (accent.kind === 'people')
    return <AvatarStack aria-label={label} people={accent.people} size="sm" />
  return (
    <IconFrame aria-hidden="true" shape="rounded" size="sm">
      {accent.icon}
    </IconFrame>
  )
}

function FactTile({ fact }: Readonly<{ fact: Card1Fact }>) {
  return (
    <div
      className="grid min-w-0 content-start gap-2 rounded-lg bg-muted/50 p-4"
      data-fact={fact.id}
    >
      <dt className="truncate text-muted-foreground text-sm">{fact.label}</dt>
      <dd className="flex min-w-0 items-center justify-between gap-3">
        <span className="min-w-0 truncate font-medium text-base">
          {fact.value}
        </span>
        {fact.accent ? (
          <FactAccent accent={fact.accent} label={fact.label} />
        ) : null}
      </dd>
    </div>
  )
}

export function Card1({
  className,
  facts,
  labels: labelsProp,
}: Readonly<Card1Props>) {
  const labels = { ...defaultCard1Labels, ...labelsProp }

  return (
    <WidgetShell aria-label={labels.title} className={className}>
      <CardPanel className="p-5">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <FactTile fact={fact} key={fact.id} />
          ))}
        </dl>
      </CardPanel>
    </WidgetShell>
  )
}
