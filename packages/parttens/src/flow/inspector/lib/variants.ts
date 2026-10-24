import type { FlowRunStatus } from '../../canvas/core'

export const flowStatusBadgeVariant = {
  failed: 'destructive',
  idle: 'outline',
  'not-run': 'outline',
  running: 'outline',
  skipped: 'secondary',
  success: 'outline',
} as const satisfies Record<FlowRunStatus, string>

export const flowStatusIconClassName = {
  failed: 'text-destructive-foreground',
  idle: 'text-muted-foreground',
  'not-run': 'text-muted-foreground',
  running: 'text-muted-foreground motion-safe:animate-spin',
  skipped: 'text-muted-foreground',
  success: 'text-muted-foreground',
} as const satisfies Record<FlowRunStatus, string>
