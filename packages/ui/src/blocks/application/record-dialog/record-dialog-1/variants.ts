import { cva } from 'class-variance-authority'

export const recordDialog1Variants = cva('', {
  defaultVariants: { part: 'body' },
  variants: {
    part: {
      body: 'flex flex-1 flex-col gap-4',
      rows: 'mt-auto',
    },
  },
})
