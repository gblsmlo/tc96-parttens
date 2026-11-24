import { cva } from 'class-variance-authority'
import type { RecordStatus } from '../core'

export const recordStatusListClassName =
  'flex flex-col divide-y divide-border overflow-hidden rounded-lg border'

export const recordStatusItemVariants = cva(
  'grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-1',
  {
    defaultVariants: { status: 'pending' },
    variants: {
      status: {
        done: '',
        failed: 'bg-destructive/8 dark:bg-destructive/16',
        pending: '',
        running: '',
        skipped: '',
      },
    },
  },
)

export const recordStatusLeadClassName =
  'grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-3'

export const recordStatusIconVariants = cva(
  'flex h-5 w-4 shrink-0 items-center',
  {
    defaultVariants: { status: 'pending' },
    variants: {
      status: {
        done: 'text-success-foreground',
        failed: 'text-destructive-foreground',
        pending: 'text-muted-foreground',
        running: 'text-muted-foreground',
        skipped: 'text-muted-foreground',
      },
    },
  },
)

export const recordStatusDetailForeground = (status: RecordStatus) =>
  status === 'failed' ? 'destructive' : 'muted'
