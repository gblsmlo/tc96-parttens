import type { Legal6Sort, Legal6Tone, Legal6View } from './types'

export const legal6Views: readonly Legal6View[] = [
  'mine',
  'overdue',
  'today',
  'week',
  'unassigned',
  'all',
  'proposed',
  'awaiting-closure',
]

export const legal6Sorts: readonly Legal6Sort[] = ['fatal', 'internal']

export const legal6ToneClasses = {
  danger: 'text-destructive-foreground',
  neutral: 'text-muted-foreground',
  warning: 'text-warning-foreground',
} as const satisfies Record<Legal6Tone, string>

export function nextLegal6ViewWithItems(
  views: readonly Legal6View[],
  view: Legal6View,
  counts: Partial<Record<Legal6View, number>> | undefined,
): Legal6View | null {
  return (
    views
      .slice(views.indexOf(view) + 1)
      .find((later) => (counts?.[later] ?? 0) > 0) ?? null
  )
}
