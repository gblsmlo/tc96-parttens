import { cva } from 'class-variance-authority'

export const recordDialog2Variants = cva('', {
  defaultVariants: { part: 'body' },
  variants: {
    part: {
      body: 'flex flex-1 flex-col gap-3',
      properties: 'mt-auto flex flex-wrap items-center gap-2',
    },
  },
})
