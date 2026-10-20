import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'
import type { RecordGroupActionsAlign, RecordGroupVariant } from '../core'

export const recordGroupClassName = (
  variant: RecordGroupVariant,
  className?: string,
) => cn('flex flex-col', variant === 'inset' && 'gap-1', className)

export const recordGroupShellClassName =
  'bg-muted/72 p-3 shadow-none before:hidden'

const recordGroupHeaderVariants = cva('flex min-h-6 items-center gap-2', {
  defaultVariants: { actionsAlign: 'between' },
  variants: {
    actionsAlign: { between: 'justify-between', start: 'justify-start' },
  },
})

export const recordGroupHeaderClassName = (
  variant: RecordGroupVariant,
  actionsAlign: RecordGroupActionsAlign,
) =>
  cn(recordGroupHeaderVariants({ actionsAlign }), variant === 'inset' && 'px-1')

export const recordGroupTriggerVariants = cva(
  'group/trigger flex min-w-0 items-center gap-1 rounded-md py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    defaultVariants: { variant: 'plain' },
    variants: { variant: { card: 'px-1', inset: 'px-1', plain: '' } },
  },
)

export const recordGroupRowHeightClassName =
  'min-h-[var(--record-group-row-height,calc(var(--spacing)*8))]'

export const recordGroupRowPaddingClassName =
  'px-[var(--record-group-row-padding,0px)]'

export const recordGroupRowGapClassName =
  'gap-[var(--record-group-row-gap,0px)]'

export const recordGroupLinkOffsetClassName =
  '-mx-[var(--record-group-hover-offset,0px)] px-[calc(var(--record-group-row-padding,0px)+var(--record-group-hover-offset,0px))]'

const recordGroupRoomyRows =
  'px-1 [--record-group-row-gap:calc(var(--spacing)*0.5)] [--record-group-row-height:calc(var(--spacing)*8)]'

const recordGroupHoverOffset =
  '[--record-group-hover-offset:calc(var(--spacing)*2)]'

const recordGroupCardRows = cn(recordGroupRoomyRows, recordGroupHoverOffset)

const recordGroupPlainRows = cn(
  '[--record-group-row-height:calc(var(--spacing)*8)]',
  recordGroupHoverOffset,
)

export const recordGroupPanelClassName = (variant: RecordGroupVariant) =>
  cn(variant !== 'inset' && '-mx-2 px-2')

export const recordGroupContentVariants = cva(
  `flex flex-col ${recordGroupRowGapClassName} has-[[data-slot=record-group-metrics]]:p-0`,
  {
    defaultVariants: { empty: false, variant: 'plain' },
    variants: {
      empty: {
        false: 'py-1',
        true: '',
      },
      variant: {
        card: recordGroupCardRows,
        inset: recordGroupCardRows,
        plain: recordGroupPlainRows,
      },
    },
  },
)

export const recordGroupRowVariants = cva(
  `${recordGroupRowHeightClassName} ${recordGroupRowPaddingClassName} items-center gap-2`,
  {
    defaultVariants: { align: 'start' },
    variants: {
      align: {
        between: 'grid grid-cols-[minmax(4rem,1fr)_minmax(0,max-content)]',
        start: 'flex',
      },
    },
  },
)

export const recordGroupRowLabelVariants = cva(
  'flex items-center gap-2 text-muted-foreground text-sm',
  {
    defaultVariants: { align: 'start' },
    variants: {
      align: {
        between: 'min-w-0 max-w-36',
        start: 'w-28 shrink-0',
      },
    },
  },
)

export const recordGroupRowValueVariants = cva(
  'flex min-w-0 items-center text-sm',
  {
    defaultVariants: { align: 'start', leading: false },
    variants: {
      align: {
        between: 'justify-end text-end',
        start: 'flex-1',
      },
      leading: {
        false: '',
        true: '[&_[data-slot=property-icon]]:hidden',
      },
    },
  },
)

export const recordGroupMetricsVariants = cva('grid gap-2', {
  defaultVariants: { columns: 2 },
  variants: { columns: { 1: 'grid-cols-1', 2: 'grid-cols-2' } },
})

export const recordGroupMetricShellClassName =
  'h-full gap-2 border-0 p-3 shadow-none before:hidden'
