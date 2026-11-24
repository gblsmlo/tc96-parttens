import { cva } from 'class-variance-authority'

export const iconRowRootVariants = cva(
  'flex w-full min-w-0 items-center gap-3 px-3 py-3 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [:is(a,button,label)&]:cursor-pointer [:is(a,button,label)&]:hover:bg-muted/50',
  {
    defaultVariants: { variant: 'outline' },
    variants: {
      variant: {
        outline: 'rounded-lg border [label&]:has-data-checked:border-primary',
        plain: '',
      },
    },
  },
)

export const iconRowContentClassName = 'flex min-w-0 flex-1 flex-col'

export const iconRowDescriptionClassName = 'line-clamp-2'

export const iconRowActionsClassName = 'flex shrink-0 items-center gap-1'
