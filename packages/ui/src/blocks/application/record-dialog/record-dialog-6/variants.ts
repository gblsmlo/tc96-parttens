import { cva } from 'class-variance-authority'

export const recordDialog6Variants = cva('', {
  defaultVariants: { part: 'heading' },
  variants: {
    part: {
      description: 'font-normal text-muted-foreground',
      group: 'ms-11',
      heading: 'flex flex-1 items-start gap-3',
      title: 'grid flex-1 gap-0.5',
    },
  },
})
