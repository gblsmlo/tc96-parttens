import type { FlowRunStatus } from '../../canvas/core'

export const flowStatusBadgeVariant = {
  failed: 'error',
  idle: 'outline',
  'not-run': 'outline',
  running: 'info',
  skipped: 'warning',
  success: 'success',
} as const satisfies Record<FlowRunStatus, string>

export const flowStatusIconClassName = {
  failed: 'text-destructive-foreground',
  idle: 'text-muted-foreground',
  'not-run': 'text-muted-foreground',
  running: 'text-info-foreground motion-safe:animate-spin',
  skipped: 'text-warning-foreground',
  success: 'text-success-foreground',
} as const satisfies Record<FlowRunStatus, string>
