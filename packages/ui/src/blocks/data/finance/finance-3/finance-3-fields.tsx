import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { cn } from '@tc96/utils'
import type { Finance3Formatter } from './finance-3-format'
import type { Finance3Direction, Finance3Due, Finance3DueTone } from './types'

const directionClass: Record<Finance3Direction, string | undefined> = {
  in: 'text-success-foreground',
  none: undefined,
  out: undefined,
}

const dueToneClass: Record<Finance3DueTone, string> = {
  danger: 'text-destructive-foreground',
  neutral: 'text-muted-foreground',
  warning: 'text-warning-foreground',
}

export function Finance3Amount({
  cents,
  direction = 'none',
  format,
}: Readonly<{
  cents: number
  direction?: Finance3Direction
  format: Finance3Formatter
}>) {
  return (
    <span
      className={cn('font-medium tabular-nums', directionClass[direction])}
      data-direction={direction}
      data-slot="finance-3-amount"
    >
      {format.amount(cents, direction)}
    </span>
  )
}

export function Finance3DueText({ due }: Readonly<{ due: Finance3Due }>) {
  return (
    <span
      className={dueToneClass[due.tone]}
      data-slot="finance-3-due"
      data-tone={due.tone}
    >
      {due.label}
    </span>
  )
}

export function Finance3TextField({
  ariaLabel,
  fallback,
  value,
}: Readonly<{ ariaLabel: string; fallback: string; value: string | null }>) {
  return (
    <TextProperty
      ariaLabel={ariaLabel}
      value={value}
      variant="plain"
      labels={{ fallback: fallback }}
    />
  )
}
