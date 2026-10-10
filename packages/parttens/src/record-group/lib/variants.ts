import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'
import type { RecordGroupVariant } from '../core'

const recordGroupVariantStyles: Record<RecordGroupVariant, string> = {
  card: 'rounded-2xl border bg-card',
  inset: 'gap-1',
  plain: '',
}

export const recordGroupClassName = (
  variant: RecordGroupVariant,
  className?: string,
) => cn('flex flex-col', recordGroupVariantStyles[variant], className)

export const recordGroupHeaderVariants = cva(
  'flex min-h-9 items-center gap-2 px-1',
  {
    defaultVariants: { actionsAlign: 'between' },
    variants: {
      actionsAlign: { between: 'justify-between', start: 'justify-start' },
    },
  },
)

export const recordGroupContentVariants = cva('flex flex-col px-1', {
  defaultVariants: { empty: false, variant: 'plain' },
  variants: {
    empty: {
      false: 'gap-0.5 py-1',
      true: 'items-center justify-center py-6 text-center',
    },
    variant: {
      card: null,
      inset: 'rounded-lg border bg-card',
      plain: null,
    },
  },
})

export const recordGroupRowVariants = cva('min-h-9 items-center gap-2 px-2', {
  defaultVariants: { align: 'start' },
  variants: {
    align: {
      between: 'grid grid-cols-[minmax(4rem,1fr)_minmax(0,max-content)]',
      start: 'flex',
    },
  },
})

export const recordGroupRowLabelVariants = cva(
  'flex items-center gap-2 text-muted-foreground text-sm',
  {
    defaultVariants: { align: 'start' },
    variants: {
      align: {
        between: 'min-w-0 max-w-30',
        start: 'w-30 shrink-0',
      },
    },
  },
)

export const recordGroupRowValueVariants = cva(
  'flex min-w-0 items-center text-sm',
  {
    defaultVariants: { align: 'start' },
    variants: {
      align: {
        between: 'justify-end text-end',
        start: 'flex-1',
      },
    },
  },
)
