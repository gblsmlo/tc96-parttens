import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'
import type { RecordGroupVariant } from '../core'

const recordGroupVariantStyles: Record<RecordGroupVariant, string> = {
  card: 'rounded-2xl border bg-card',
  plain: '',
}

export const recordGroupClassName = (
  variant: RecordGroupVariant,
  className?: string,
) => cn('flex flex-col', recordGroupVariantStyles[variant], className)

export const recordGroupContentVariants = cva('flex flex-col px-1 py-1', {
  defaultVariants: { empty: false },
  variants: {
    empty: {
      false: 'gap-0.5',
      true: 'items-center justify-center py-6 text-center',
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
        between: 'min-w-0',
        start: 'w-32 shrink-0',
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
